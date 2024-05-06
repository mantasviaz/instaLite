package storage;

import org.apache.spark.sql.Row;
import org.apache.spark.sql.RowFactory;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.core.sync.ResponseTransformer;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;
import software.amazon.awssdk.core.ResponseBytes;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.io.File;
import java.io.InputStream;

import storage.config.Config;

public class S3Setup {

    private static final S3Client s3 = S3Client.builder()
            .region(Region.of(Config.AWS_REGION))
            .build();
    

    //Upload an image to s3 given the file, the bucket name, and unique id
    public static void uploadToS3(String s3Bucket, String s3Key, String file_path) {
    //public static void uploadToS3(String s3Bucket, String s3Key, byte[] imageData) {

        // Upload item to S3
        try {
            /* TODO: Create PutObject request and run s3.putObject with request */
            PutObjectRequest request = PutObjectRequest.builder()
            .bucket(s3Bucket)
            .key(s3Key)
            .build();
        
            s3.putObject(request, RequestBody.fromFile(new File(file_path)));
            //s3.putObject(request, RequestBody.fromBytes(imageData));
            System.out.println("Image uploaded successfully");
        } catch (S3Exception e) {
            // Handle the S3 exception, log it, and propagate it
            System.err.println("Error uploading to S3: " + e.getMessage());
            throw e;
        }
    }

     //Get an image from the S3 bucket given the bucket name and unique id
    public static String getImageURL(String s3Bucket, String s3Key) {
        String s3Path = "https://" + s3Bucket + ".s3.amazonaws.com/" + s3Key;
        System.out.println(s3Path);
        return s3Path;
    }
}
