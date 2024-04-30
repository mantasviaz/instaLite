package org.nets2120.storage;

import org.apache.spark.sql.Row;
import org.apache.spark.sql.RowFactory;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.nets2120.imdbIndexer.config.Config;

public class S3Setup {
    private static final S3Client s3 = S3Client.builder()
            .region(Region.of(Config.AWS_REGION))
            .build();

  
}
