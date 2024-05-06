package storage;

import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaSparkContext;
import org.apache.spark.sql.Dataset;
import org.apache.spark.sql.Row;
import org.apache.spark.sql.SparkSession;
import org.apache.spark.sql.types.DataTypes;
import org.apache.spark.sql.types.StructType;
import storage.config.Config;

public class Test {
    public static void main(String[] args) {
        S3Setup.uploadToS3(Config.S3_BUCKET_NAME, "instaImage", "/nets2120/project-leftovers/instagram-screenshot.png");
        S3Setup.getFromS3(Config.S3_BUCKET_NAME, "instaImage");
    }
}
