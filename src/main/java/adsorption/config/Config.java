package adsorption.config;


public class Config {
     
    // For test drivers
    public static void setSocialPath(String path) {
        SOCIAL_NET_PATH = path;
    }

    /**
     * The path to the space-delimited social network data
     */
    public static String SOCIAL_NET_PATH = 
    "/nets2120/project-leftovers/src/main/java/adsorption/simple-example.txt";
    //"s3a://penn-cis545-files/movie_friends.txt";

    public static String LOCAL_SPARK = "local[*]";

    public static String JAR = "target/nets2120-project-leftovers-0.0.1-SNAPSHOT.jar";

    // these will be set via environment variables
    public static String ACCESS_KEY_ID = System.getenv("AWS_ACCESS_KEY_ID");
    public static String SECRET_ACCESS_KEY = System.getenv("AWS_SECRET_ACCESS_KEY");
    public static String SESSION_TOKEN = System.getenv("AWS_SESSION_TOKEN");

    /**
     * How many RDD partitions to use?
     */
    public static int PARTITIONS = 5;
}
