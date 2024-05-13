import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaPairRDD;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.JavaSparkContext;
import scala.Tuple2;

import java.util.*;

public class AdsorptionAlgorithm {
    private static final int MAX_ITERATIONS = 15;
    private static final double USER_HASHTAG_WEIGHT = 0.3;
    private static final double USER_POST_WEIGHT = 0.4;
    private static final double USER_USER_WEIGHT = 0.3;

    public static void main(String[] args) {
        SparkConf conf = new SparkConf().setAppName("AdsorptionAlgorithm");
        JavaSparkContext sc = new JavaSparkContext(conf);

        // Create user nodes with initial label weights
        JavaRDD<Tuple2<String, Double>> users = sc.parallelize(Arrays.asList(
                new Tuple2<>("Alice", 1.0),
                new Tuple2<>("Bob", 1.0),
                // Add more users...
        ));

        // Create hashtag nodes
        JavaRDD<String> hashtags = sc.parallelize(Arrays.asList(
                "hashtag1",
                "hashtag2",
                // Add more hashtags...
        ));

        // Create post nodes
        JavaRDD<String> posts = sc.parallelize(Arrays.asList(
                "post1",
                "post2",
                // Add more posts...
        ));

        // Create user-hashtag edges
        JavaPairRDD<String, String> userHashtagEdges = sc.parallelizePairs(Arrays.asList(
                new Tuple2<>("Alice", "hashtag1"),
                new Tuple2<>("Bob", "hashtag2"),
                // Add more user-hashtag edges...
        ));

        // Create hashtag-post edges
        JavaPairRDD<String, String> hashtagPostEdges = sc.parallelizePairs(Arrays.asList(
                new Tuple2<>("hashtag1", "post1"),
                new Tuple2<>("hashtag2", "post2"),
                // Add more hashtag-post edges...
        ));

        // Create user-post edges
        JavaPairRDD<String, String> userPostEdges = sc.parallelizePairs(Arrays.asList(
                new Tuple2<>("Alice", "post1"),
                new Tuple2<>("Bob", "post2"),
                // Add more user-post edges...
        ));

        // Create user-user edges
        JavaPairRDD<String, String> userUserEdges = sc.parallelizePairs(Arrays.asList(
                new Tuple2<>("Alice", "Bob"),
                // Add more user-user edges...
        ));

        // Perform adsorption algorithm for a fixed number of iterations or until convergence
        for (int i = 0; i < MAX_ITERATIONS; i++) {
            // Propagate label weights forward
            JavaPairRDD<String, Double> hashtag

            Weights = userHashtagEdges.join(users).mapValues(tuple -> tuple._2 * USER_HASHTAG_WEIGHT).reduceByKey(Double::sum);
            JavaPairRDD<String, Double> postWeights = userPostEdges.join(users).mapValues(tuple -> tuple._2 * USER_POST_WEIGHT).reduceByKey(Double::sum)
                    .union(hashtagPostEdges.join(hashtagWeights).mapValues(tuple -> tuple._2));

            // Normalize label weights on hashtags and posts
            hashtag.Weights = normalizeWeights(hashtagWeights);
            postWeights = normalizeWeights(postWeights);

            // Propagate label weights backward
            JavaPairRDD<String, Double> userWeightsFromHashtags = userHashtagEdges.join(hashtagWeights).mapValues(tuple -> tuple._2).reduceByKey(Double::sum);
            JavaPairRDD<String, Double> userWeightsFromPosts = userPostEdges.join(postWeights).mapValues(tuple -> tuple._2).reduceByKey(Double::sum);
            JavaPairRDD<String, Double> userWeightsFromUsers = userUserEdges.join(users).mapValues(tuple -> tuple._2 * USER_USER_WEIGHT).reduceByKey(Double::sum);

            // Combine and normalize user label weights
            users = userWeightsFromHashtags.union(userWeightsFromPosts).union(userWeightsFromUsers)
                    .reduceByKey(Double::sum)
                    .mapValues(weight -> Math.max(weight, 1.0)); // Hard code user's own label weight to 1.0
        }

        // Output the final label weights for hashtags and posts
        System.out.println("Hashtag Weights:");
        hashtagWeights.collect().forEach(System.out::println);
        System.out.println("Post Weights:");
        postWeights.collect().forEach(System.out::println);

        // Recommend posts to users based on label weights
        JavaPairRDD<String, String> recommendations = users.cartesian(postWeights)
                .filter(tuple -> !userPostEdges.collect().contains(new Tuple2<>(tuple._1._1, tuple._2._1)))
                .mapToPair(tuple -> new Tuple2<>(tuple._1._1, new Tuple2<>(tuple._2._1, tuple._2._2)))
                .groupByKey()
                .mapValues(pairs -> {
                    List<Tuple2<String, Double>> sortedPosts = new ArrayList<>(pairs);
                    sortedPosts.sort((p1, p2) -> Double.compare(p2._2, p1._2));
                    return sortedPosts.stream().map(Tuple2::_1).limit(10).collect(Collectors.toList());
                });

        // Print the recommended posts for each user
        System.out.println("Recommended Posts:");
        recommendations.collect().forEach(System.out::println);

        sc.close();
    }

    private static JavaPairRDD<String, Double> normalizeWeights(JavaPairRDD<String, Double> weights) {
        Double sum = weights.values().reduce(Double::sum);
        return weights.mapValues(weight -> weight / sum);
    }
}