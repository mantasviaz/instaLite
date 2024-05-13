package adsorption;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.FileWriter;
import java.io.File;
import java.io.Serializable;

import java.sql.SQLException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;
import java.sql.ResultSet;
import java.sql.DriverManager;
import java.sql.Statement;
import java.util.stream.Collectors;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.spark.api.java.JavaPairRDD;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.JavaSparkContext;
import org.apache.spark.sql.SparkSession;

import adsorption.config.Config;
import adsorption.engine.SparkConnector;

import scala.Tuple2;

import java.util.*;
import java.lang.Math;

public class ComputeRanks implements Serializable {
    /**
     * The basic logger
     */
    static Logger logger = LogManager.getLogger(ComputeRanks.class);
    private static final int MAX_ITERATIONS = 15;
    private static final double HASHTAG_WEIGHT = 0.3;
    private static final double POST_WEIGHT = 0.4;
    private static final double FRIEND_WEIGHT = 0.3;
    protected static SparkSession spark;
    protected static JavaSparkContext sc;

    /**
     * Initialize the connection to Spark
     *
     * @throws IOException
     * @throws InterruptedException
     */
    public static void initialize() throws IOException, InterruptedException {
        logger.info("Connecting to Spark...");

        spark = SparkConnector.getSparkConnection();
        sc = SparkConnector.getSparkContext();

        logger.info("Connected!");
    }

    public static void main(String[] args) throws IOException, InterruptedException {
        initialize();


        // Read input data
        JavaRDD<UserData> userDataRDD = readUserDataLocal(sc);
        JavaRDD<Hashtag> hashtagDataRDD = readHashtagDataLocal(sc);
        JavaRDD<Post> postDataRDD = readPostDataLocal(sc);

        // Build the graph
        JavaPairRDD<String, Node> graph = buildGraph(userDataRDD, hashtagDataRDD, postDataRDD);

        // Run adsorption
        JavaPairRDD<String, Node> rankedNodes = runAdsorption(graph);

        // Print the graph
        printGraph(rankedNodes);

        // Get top posts for each user
        List<Tuple2<String, Double>> userRecommendations = recommendPosts(rankedNodes, "u1");

        // Save recommendations
        try (PrintWriter writer = new PrintWriter(new File("/nets2120/project-leftovers/recommendations.csv"))) {
            // Write CSV header
            writer.println("Post ID,Label Weight");
    
            // Write each post and its label weight to the CSV file
            for (Tuple2<String, Double> postTuple : userRecommendations) {
                String postId = postTuple._1();
                Double labelWeight = postTuple._2();
                writer.println(postId + "," + labelWeight);
            }
    
            System.out.println("Recommended posts saved");
        } catch (IOException e) {
            e.printStackTrace();
        }

        sc.close();
    }

    private static List<Tuple2<String, Double>> recommendPosts(JavaPairRDD<String, Node> rankedNodes, String userId) {
    // Filter out post nodes
    JavaRDD<Node> postNodes = rankedNodes.filter(node -> node._2().getType() == Node.Type.POST).values();

    // Map each post node to a tuple of (postId, labelWeight) for the specific user
    JavaRDD<Tuple2<String, Double>> postLabelWeights = postNodes.map(postNode -> {
        String postId = postNode.getId();
        Map<String, Double> labelWeights = postNode.getLabelWeights();
        Double labelWeight = labelWeights.getOrDefault(userId, 0.0);
        return new Tuple2<>(postId, labelWeight);
    });

    // Sort the posts by label weight in descending order
    List<Tuple2<String, Double>> sortedPosts = postLabelWeights.collect();
    List<Tuple2<String, Double>> sortedPostsList = new ArrayList<>(sortedPosts);
    sortedPostsList.sort(new SerializableComparator());

    return sortedPostsList;
    }

    private static JavaRDD<UserData> readUserDataLocal(JavaSparkContext sc) {
        // Read user data from storage
        return sc.textFile("/nets2120/project-leftovers/src/main/java/adsorption/userTest.txt").map(UserData::parseFromString);
    }

    private static JavaRDD<Hashtag> readHashtagDataLocal(JavaSparkContext sc) {
        // Read hashtag data from storage
        return sc.textFile("/nets2120/project-leftovers/src/main/java/adsorption/hashtagTest.txt").map(Hashtag::parseFromString);
    }

    private static JavaRDD<Post> readPostDataLocal(JavaSparkContext sc) {
        // Read post data from storage
        return sc.textFile("/nets2120/project-leftovers/src/main/java/adsorption/postTest.txt").map(Post::parseFromString);
    }

    private static JavaRDD<UserData> readUserData(JavaSparkContext sc) {
        // Database connection details
        String jdbcUrl = "jdbc:mysql://database-3.cy8iw4vwyvgm.us-east-1.rds.amazonaws.com:3306/database-3";
        String username = "admin";
        String password = "adminpassword";  
        
        // Create a connection to the database
        Connection conn = null;
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            conn = DriverManager.getConnection(jdbcUrl, username, password);
    
            // Execute the SQL query to retrieve user data
            String sql = "SELECT u.userId, " +
                     "GROUP_CONCAT(DISTINCT h.hashtagId SEPARATOR '|') AS hashtags, " +
                     "GROUP_CONCAT(DISTINCT p.postId SEPARATOR '|') AS liked_posts, " +
                     "GROUP_CONCAT(DISTINCT f.user_id_2 SEPARATOR '|') AS friends " +
                     "FROM users u " +
                     "LEFT JOIN user_hashtags uh ON u.userId = uh.user_id " +
                     "LEFT JOIN hashtags h ON uh.hashtag_id = h.hashtagId " +
                     "LEFT JOIN likes l ON u.userId = l.userId " +
                     "LEFT JOIN posts p ON l.postId = p.postId " +
                     "LEFT JOIN friendships f ON u.userId = f.user_id_1 AND f.status = 'accepted' " +
                     "GROUP BY u.userId";
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery(sql);
    
            // Create a list to store user data
            List<UserData> userData = new ArrayList<>();
    
            // Iterate over the result set and create UserData objects
            while (rs.next()) {
                String userId = rs.getString("userId");
                String hashtags = rs.getString("hashtags");
                String likedPosts = rs.getString("liked_posts");
                String friends = rs.getString("friends");
    
                List<String> hashtagList = new ArrayList<>();
                if (hashtags != null && !hashtags.isEmpty()) {
                    hashtagList = Arrays.asList(hashtags.split("\\|"));
                }

                List<String> likedPostList = new ArrayList<>();
                if (likedPosts != null && !likedPosts.isEmpty()) {
                    likedPostList = Arrays.asList(likedPosts.split("\\|"));
                }
                
                List<String> friendList = new ArrayList<>();
                if (friends != null && !friends.isEmpty()) {
                    friendList = Arrays.asList(friends.split("\\|"));
                }                
    
                UserData user = new UserData(userId, hashtagList, likedPostList, friendList);
                userData.add(user);
            }
    
            // Close the result set, statement, and connection
            rs.close();
            stmt.close();
            conn.close();
    
            // Parallelize the user data and return as JavaRDD
            return sc.parallelize(userData);
    
        } catch (ClassNotFoundException | SQLException e) {
            e.printStackTrace();
            // Handle the exception appropriately
        } finally {
            // Close the connection in the finally block
            if (conn != null) {
                try {
                    conn.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }

    // Return an empty JavaRDD in case of an exception
    return sc.emptyRDD();
    }

    private static JavaRDD<Hashtag> readHashtagData(JavaSparkContext sc) {
        // Database connection details
        String jdbcUrl = "jdbc:mysql://database-3.cy8iw4vwyvgm.us-east-1.rds.amazonaws.com:3306/database-3";
        String username = "admin";
        String password = "adminpassword";  
        
        // Create a connection to the database
        Connection conn = null;
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            conn = DriverManager.getConnection(jdbcUrl, username, password);
    
                // Execute the SQL query to retrieve hashtag data
                String sql = "SELECT h.hashtagId, " +
                "GROUP_CONCAT(DISTINCT u.userId SEPARATOR '|') AS users, " +
                "GROUP_CONCAT(DISTINCT p.postId SEPARATOR '|') AS posts " +
                "FROM hashtags h " +
                "LEFT JOIN user_hashtags uh ON h.hashtagId = uh.hashtag_Id " +
                "LEFT JOIN users u ON uh.user_id = u.userId " +
                "LEFT JOIN post_hashtags ph ON h.hashtagId = ph.hashtagId " +
                "LEFT JOIN posts p ON ph.postId = p.postId " +
                "GROUP BY h.hashtagId";

            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery(sql);
    
            // Create a list to store hashtag data
        List<Hashtag> hashtagData = new ArrayList<>();

        // Iterate over the result set and create Hashtag objects
        while (rs.next()) {
            String hashtagId = rs.getString("hashtagId");
            String users = rs.getString("users");
            String posts = rs.getString("posts");

            List<String> userList = users != null ? Arrays.asList(users.split("\\|")) : new ArrayList<>();
            List<String> postList = posts != null ? Arrays.asList(posts.split("\\|")) : new ArrayList<>();

            Hashtag hashtag = new Hashtag(hashtagId, userList, postList);
            hashtagData.add(hashtag);
        }

        // Close the result set, statement, and connection
        rs.close();
        stmt.close();
        conn.close();

        // Parallelize the hashtag data and return as JavaRDD
        return sc.parallelize(hashtagData);

    } catch (ClassNotFoundException | SQLException e) {
        e.printStackTrace();
        // Handle the exception appropriately
    } finally {
        // Close the connection in the finally block
        if (conn != null) {
            try {
                conn.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }

        // Return an empty JavaRDD in case of an exception
        return sc.emptyRDD();
    }

    private static JavaRDD<Post> readPostData(JavaSparkContext sc) {
        // Database connection details
        String jdbcUrl = "jdbc:mysql://database-3.cy8iw4vwyvgm.us-east-1.rds.amazonaws.com:3306/database-3";
        String username = "admin";
        String password = "adminpassword"; 

        // Create a connection to the database
        Connection conn = null;
        try {
            Class.forName("com.mysql.jdbc.Driver");
            conn = DriverManager.getConnection(jdbcUrl, username, password);
    
            // Execute the SQL query to retrieve post data
            String sql = "SELECT p.postId, " +
                         "GROUP_CONCAT(DISTINCT h.hashtagId SEPARATOR '|') AS hashtags, " +
                         "GROUP_CONCAT(DISTINCT l.userId SEPARATOR '|') AS liked_by_users " +
                         "FROM posts p " +
                         "LEFT JOIN post_hashtags ph ON p.postId = ph.postId " +
                         "LEFT JOIN hashtags h ON ph.hashtagId = h.hashtagId " +
                         "LEFT JOIN likes l ON p.postId = l.postId " +
                         "GROUP BY p.postId";
    
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery(sql);
    
            // Create a list to store post data
            List<Post> postData = new ArrayList<>();
    
            // Iterate over the result set and create Post objects
            while (rs.next()) {
                String postId = rs.getString("postId");
                String hashtags = rs.getString("hashtags");
                String likedByUsers = rs.getString("liked_by_users");
    
                List<String> hashtagList = hashtags != null ? Arrays.asList(hashtags.split("\\|")) : new ArrayList<>();
                List<String> likedByUserList = likedByUsers != null ? Arrays.asList(likedByUsers.split("\\|")) : new ArrayList<>();
    
                Post post = new Post(postId, hashtagList, likedByUserList);
                postData.add(post);
            }
    
            // Close the result set, statement, and connection
            rs.close();
            stmt.close();
            conn.close();
    
            // Parallelize the post data and return as JavaRDD
            return sc.parallelize(postData);
    
        } catch (ClassNotFoundException | SQLException e) {
            e.printStackTrace();
            // Handle the exception appropriately
        } finally {
            // Close the connection in the finally block
            if (conn != null) {
                try {
                    conn.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }
    
        // Return an empty JavaRDD in case of an exception
        return sc.emptyRDD();
    }

    private static JavaPairRDD<String, Node> buildGraph(JavaRDD<UserData> userData,
                                            JavaRDD<Hashtag> hashtagData,
                                            JavaRDD<Post> postData) {
        System.out.println("building graph");                                      
        JavaRDD<Node> userNodes = userData.map(ud -> {
            Node node = new Node(ud.getUserId(), Node.Type.USER);
            node.setOutEdges(new ArrayList<>());
            return node;
        });

        JavaRDD<Node> hashtagNodes = hashtagData.map(ht -> {
            Node node = new Node(ht.getHashtagId(), Node.Type.HASHTAG);
            node.setOutEdges(new ArrayList<>());
            return node;
        });

        JavaRDD<Node> postNodes = postData.map(p -> {
            Node node = new Node(p.getPostId(), Node.Type.POST);
            node.setOutEdges(new ArrayList<>());
            return node;
        });

        JavaPairRDD<String, UserData> userDataPairRDD = userData.mapToPair(UserData -> new Tuple2<>(UserData.getUserId(), UserData));
        JavaPairRDD<String, Hashtag> hashtagDataPairRDD = hashtagData.mapToPair(Hashtag -> new Tuple2<>(Hashtag.getHashtagId(), Hashtag));
        JavaPairRDD<String, Post> postDataPairRDD = postData.mapToPair(Post -> new Tuple2<>(Post.getPostId(), Post));

        JavaPairRDD<String, Node> userPairRDD = userNodes.mapToPair(node-> new Tuple2<>(node.getId(), node));
        JavaPairRDD<String, Node> hashtagPairRDD = hashtagNodes.mapToPair(node-> new Tuple2<>(node.getId(), node));
        JavaPairRDD<String, Node> postPairRDD = postNodes.mapToPair(node-> new Tuple2<>(node.getId(), node));

        JavaPairRDD<String, Tuple2<UserData, Node>> fullUserPairRDD = userDataPairRDD.join(userPairRDD);
        JavaPairRDD<String, Tuple2<Hashtag, Node>> fullHashtagPairRDD = hashtagDataPairRDD.join(hashtagPairRDD);
        JavaPairRDD<String, Tuple2<Post, Node>> fullPostPairRDD = postDataPairRDD.join(postPairRDD);
        
        JavaPairRDD<String, Tuple2<UserData, Node>> updatedFullUserPairRDD = fullUserPairRDD.mapToPair(vertex -> {
            UserData ud = vertex._2._1;
            List<Edge> outEdges = new ArrayList<>();

            Map<String, Double> labelWeights = new HashMap<>();
            labelWeights.put(vertex._1, 1.0);
            vertex._2._2.setLabelWeights(labelWeights);

             // Add edges to hashtag nodes
             List<String> hashtags = ud.getHashtags();
             for (String hashtag : hashtags) {
                 outEdges.add(new Edge(vertex._2._2.getId(), hashtag, HASHTAG_WEIGHT / hashtags.size()));
             }

             // Add edges to post nodes
             List<String> likedPosts = ud.getLikedPosts();
             for (String post : likedPosts) {
                 outEdges.add(new Edge(vertex._2._2.getId(), post, POST_WEIGHT / likedPosts.size()));
             }

             // Add edges to friend nodes
             List<String> friends = ud.getFriends();
             for (String friend : friends) {
                 outEdges.add(new Edge(vertex._2._2.getId(), friend, FRIEND_WEIGHT / friends.size()));
             }
            vertex._2._2.setOutEdges(outEdges);
            return vertex;
        });

        JavaPairRDD<String, Tuple2<Hashtag, Node>> updatedFullHashtagPairRDD = fullHashtagPairRDD.mapToPair(vertex -> {
            Hashtag ht = vertex._2._1;
            List<Edge> outEdges = new ArrayList<>();

            // Add edges to user nodes
            List<String> users = ht.getUsers();
            List<String> posts = ht.getPosts();
            for (String user : users) {
                outEdges.add(new Edge(vertex._2._2.getId(), user, 1.0 / (users.size() + posts.size())));
            }

            // Add edges to post nodes
            for (String post : posts) {
                outEdges.add(new Edge(vertex._2._2.getId(), post, 1.0 / (users.size() + posts.size())));
            }

            vertex._2._2.setOutEdges(outEdges);
            return vertex;   
        });

        JavaPairRDD<String, Tuple2<Post, Node>> updatedFullPostPairRDD = fullPostPairRDD.mapToPair(vertex -> {
            Post p = vertex._2._1;
            List<Edge> outEdges = new ArrayList<>();

            // Add edges to user nodes
            List<String> users = p.getLikedByUsers();
            List<String> hashtags = p.getHashtags();
            for (String user : users) {
                outEdges.add(new Edge(vertex._2._2.getId(), user, 1.0 / (users.size() + hashtags.size())));
            }

            // Add edges to hashtag nodes
            for (String hashtag : hashtags) {
                outEdges.add(new Edge(vertex._2._2.getId(), hashtag, 1.0 / (users.size() + hashtags.size())));
            }

            vertex._2._2.setOutEdges(outEdges);  
            return vertex;  
        });

        JavaPairRDD<String, Node> allNodes = updatedFullUserPairRDD.mapToPair(vertex -> new Tuple2<>(vertex._1, vertex._2._2))
        .union(updatedFullHashtagPairRDD.mapToPair(vertex -> new Tuple2<>(vertex._1, vertex._2._2)))
        .union(updatedFullPostPairRDD.mapToPair(vertex -> new Tuple2<>(vertex._1, vertex._2._2)));

        return allNodes;
    }

    private static void printGraph(JavaPairRDD<String, Node> graph) {
        List<Tuple2<String, Node>> nodeList = graph.collect();
        
        try (PrintWriter writer = new PrintWriter(new File("/nets2120/project-leftovers/test.csv"))) {
            // Write CSV header
            writer.println("Node ID,Node Type,Out Edges,In Edges,Label Weights");
            
            for (Tuple2<String, Node> nodeTuple : nodeList) {
                String nodeId = nodeTuple._1();
                Node node = nodeTuple._2();
                
                // Write node information to CSV
                writer.print(nodeId + ",");
                writer.print(node.getType() + ",");
                
                // Write out edges
                List<Edge> outEdges = node.getOutEdges();
                writer.print("[");
                for (int i = 0; i < outEdges.size(); i++) {
                    Edge edge = outEdges.get(i);
                    writer.print(edge.getDstId() + ":" + edge.getWeight());
                    if (i < outEdges.size() - 1) {
                        writer.print("|");
                    }
                }
                writer.print("],");
                
                // Write in edges
                List<Edge> inEdges = getInEdges(nodeId, graph);
                writer.print("[");
                for (int i = 0; i < inEdges.size(); i++) {
                    Edge edge = inEdges.get(i);
                    writer.print(edge.getSrcId() + ":" + edge.getWeight());
                    if (i < inEdges.size() - 1) {
                        writer.print("|");
                    }
                }
                writer.print("],");
                
                // Write label weights
                Map<String, Double> labelWeights = node.getLabelWeights();
                writer.print("[");
                int i = 0;
                for (Map.Entry<String, Double> entry : labelWeights.entrySet()) {
                    writer.print(entry.getKey() + ":" + entry.getValue());
                    if (i < labelWeights.size() - 1) {
                        writer.print("|");
                    }
                    i++;
                }
                writer.println("]");
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }


    private static JavaPairRDD<String, Node> runAdsorption(JavaPairRDD<String, Node> nodesPairRDD) throws IOException, InterruptedException {
        JavaPairRDD<String, Node> currentNodePairs = nodesPairRDD;

        for (int iter = 0; iter < MAX_ITERATIONS; iter++) {
            JavaPairRDD<String, Map> currentLabelWeights = currentNodePairs.mapToPair(node -> new Tuple2<>(node._1, node._2.getLabelWeights()));

            JavaPairRDD<String, Integer> inEdgesNumber = currentNodePairs.flatMapToPair(item -> {
                Node node = item._2();
                return node.getOutEdges().stream()
                           .map(edge -> new Tuple2<>(edge.getDstId(), 1))
                           .iterator();
            });

            // Reduce by key to sum all the 1's for each destination node ID, giving us the count of incoming edges
            JavaPairRDD<String, Integer> inEdgeCounts = inEdgesNumber.reduceByKey(Integer::sum);

            
            // Create an RDD of all edges
            JavaPairRDD<String, Tuple2<String, Double>> edges = currentNodePairs.flatMapToPair(nodeEntry -> {
                Node node = nodeEntry._2();
                List<Tuple2<String, Tuple2<String, Double>>> edgeList = new ArrayList<>();
                for (Edge edge : node.getOutEdges()) {
                    edgeList.add(new Tuple2<>(node.getId(), new Tuple2<>(edge.getDstId(), edge.getWeight())));
                }
                return edgeList.iterator();
            });

            JavaPairRDD<String, Tuple2<Tuple2<String, Double>, Map>> linkedWeightEdges = edges.join(currentLabelWeights);
            JavaPairRDD<String, Tuple2<Tuple2<String, Double>, Map>> linkedWeightNodesEdges = linkedWeightEdges.mapToPair(node -> new Tuple2<>(node._2._1._1,
             new Tuple2<>(new Tuple2<>(node._1, node._2._1._2), node._2._2)));

            // Join edges with nodes to apply the adsorption algorithm
            JavaPairRDD<String, Tuple2<Tuple2<Tuple2<String, Double>, Map>, Node>> joined = linkedWeightNodesEdges.join(currentNodePairs);
            JavaPairRDD<String, Tuple2<Tuple2<Tuple2<Tuple2<String, Double>, Map>, Node>, Integer>> joinedInEdgeCounts = joined.join(inEdgeCounts);

            // For each node, collect labels and weights from neighbors
            JavaPairRDD<String, Node> updatedNodes = joinedInEdgeCounts.mapToPair(nodeEntry -> {
                Node node = nodeEntry._2._1._2;
                Map<String, Double> labelWeights = node.getLabelWeights();
                //labelWeights.replaceAll((label, weight) -> weight / nodeEntry._2._2);///////////////////////////////////////////////////
                double edgeWeight = nodeEntry._2._1._1._1._2;

                Map<String, Double> sourceLabelWeights = nodeEntry._2._1._1._2;

                    // Multiply the source label weights by the edge weight and add to the main node's label weights
                    for (Map.Entry<String, Double> entry : sourceLabelWeights.entrySet()) {
                        String label = entry.getKey();
                        double weight = entry.getValue() * edgeWeight;
                        labelWeights.merge(label, weight, Double::sum);
                    }
                

                // Update node's label weights
                node.setLabelWeights(labelWeights);

                return new Tuple2<>(nodeEntry._1, node);
                
            }).reduceByKey((node1, node2) -> {
                Node mergedNode = new Node(node1.getId(), node1.getType());
                Map<String, Double> mergedLabelWeights = new HashMap<>(node1.getLabelWeights());
                node2.getLabelWeights().forEach((label, weight) ->
                    mergedLabelWeights.merge(label, weight, Double::sum));
                // Normalize weights again if needed
                double totalWeight = mergedLabelWeights.values().stream().mapToDouble(w -> w).sum();
                mergedLabelWeights.replaceAll((label, weight) -> weight / totalWeight);
                mergedNode.setLabelWeights(mergedLabelWeights);

                // Combine out edges using a set to automatically remove duplicates
                Set<Edge> mergedOutEdges = new HashSet<>(node1.getOutEdges());
                mergedOutEdges.addAll(node2.getOutEdges());
                mergedNode.setOutEdges(new ArrayList<>(mergedOutEdges)); // Convert back to list if needed
               
                return mergedNode;
            });

            currentNodePairs = updatedNodes;
        }
        return currentNodePairs;
    }

    private static List<Edge> getInEdges(String nodeId, JavaPairRDD<String, Node> nodesPairRDD) {
        return nodesPairRDD.flatMapToPair(nodeTuple -> {
            Node node = nodeTuple._2();
            return node.getOutEdges().stream()
                .filter(e -> e.getDstId().equals(nodeId))
                .map(e -> new Tuple2<>(e.getSrcId(), e))
                .iterator();
        }).values().collect();
    }

    private static class Node implements Serializable {
        private String id;
        private Type type;
        private List<Edge> outEdges;
        private Map<String, Double> labelWeights;

        public Node(String id, Type type) {
            this.id = id;
            this.type = type;
            this.outEdges = new ArrayList<>();
            this.labelWeights = new HashMap<>();
        }

        public String getId() {
            return id;
        }

        public Type getType() {
            return type;
        }

        public List<Edge> getOutEdges() {
            return outEdges;
        }

        public void setOutEdges(List<Edge> outEdges) {
            this.outEdges = outEdges;
        }

        public Map<String, Double> getLabelWeights() {
            return labelWeights;
        }

        public void setLabelWeights(Map<String, Double> labelWeights) {
            this.labelWeights = labelWeights;
        }

        public enum Type {
            USER, HASHTAG, POST
        }
    }

    private static class Edge implements Serializable {
        private String srcId;
        private String dstId;
        private double weight;

        public Edge(String srcId, String dstId, double weight) {
            this.srcId = srcId;
            this.dstId = dstId;
            this.weight = weight;
        }

        public String getSrcId() {
            return srcId;
        }

        public String getDstId() {
            return dstId;
        }

        public double getWeight() {
            return weight;
        }
    }

    private static class UserData implements Serializable {
        private String userId;
        private List<String> hashtags;
        private List<String> likedPosts;
        private List<String> friends;

        public UserData(String userId, List<String> hashtags, List<String> likedPosts, List<String> friends) {
            this.userId = userId;
            this.hashtags = hashtags;
            this.likedPosts = likedPosts;
            this.friends = friends;
        }

        public String getUserId() {
            return userId;
        }

        public List<String> getHashtags() {
            return hashtags;
        }

        public List<String> getLikedPosts() {
            return likedPosts;
        }

        public List<String> getFriends() {
            return friends;
        }


        public static UserData parseFromString(String str) {
            String[] fields = str.split(",");
            String userId = fields[0];
            List<String> hashtags = Arrays.asList(fields[1].split("\\|"));
            List<String> likedPosts = Arrays.asList(fields[2].split("\\|"));
            List<String> friends = Arrays.asList(fields[3].split("\\|"));
            return new UserData(userId, hashtags, likedPosts, friends);
        }
    
    }    

    private static class Hashtag implements Serializable {
        private String hashtagId;
        private List<String> users;
        private List<String> posts;

        public Hashtag(String hashtagId, List<String> users, List<String> posts) {
            this.hashtagId = hashtagId;
            this.users = users;
            this.posts = posts;
        }

        public String getHashtagId() {
            return hashtagId;
        }

        public List<String> getUsers() {
            return users;
        }

        public List<String> getPosts() {
            return posts;
        }

        public static Hashtag parseFromString(String str) {
            String[] fields = str.split(",");
            String hashtagId = fields[0];
            List<String> users = Arrays.asList(fields[1].split("\\|"));
            List<String> posts = Arrays.asList(fields[2].split("\\|"));
            return new Hashtag(hashtagId, users, posts);
        }
    
    }
    
    private static class Post implements Serializable {
        private String postId;
        private List<String> hashtags;
        private List<String> likedByUsers;

        public Post(String postId,  List<String> hashtags, List<String> likedByUsers) {
            this.postId = postId;
            this.hashtags = hashtags;
            this.likedByUsers = likedByUsers;
        }

        public String getPostId() {
            return postId;
        }

        public List<String> getHashtags() {
            return hashtags;
        }

        public List<String> getLikedByUsers() {
            return likedByUsers;
        }

        public static Post parseFromString(String str) {
            String[] fields = str.split(",");
            String postId = fields[0];
            List<String> hashtags = Arrays.asList(fields[1].split("\\|"));
            List<String> likedByUsers = Arrays.asList(fields[2].split("\\|"));
            return new Post(postId, hashtags, likedByUsers);
        }
    }

    
    // Helper comparator for sorting ranks in descending order
    static class SerializableComparator implements Comparator<Tuple2<String, Double>>, Serializable {
        @Override
        public int compare(Tuple2<String, Double> o1, Tuple2<String, Double> o2) {
            return o2._2.compareTo(o1._2);
        } 
    }
}
