from __future__ import annotations

import os
from typing import Any


class ObjectStore:
    def create_multipart(self, key: str, content_type: str) -> str:
        raise NotImplementedError

    def upload_part(self, key: str, upload_id: str, part_number: int, body: bytes) -> str:
        raise NotImplementedError

    def complete_multipart(
        self, key: str, upload_id: str, parts: list[tuple[int, str]]
    ) -> None:
        raise NotImplementedError

    def abort_multipart(self, key: str, upload_id: str) -> None:
        raise NotImplementedError

    def get_bytes(self, key: str) -> bytes:
        raise NotImplementedError

    def delete(self, key: str) -> None:
        raise NotImplementedError

    def presign_get(self, key: str, expires_s: int = 3600) -> str:
        raise NotImplementedError


class S3Store(ObjectStore):
    """S3 API client. Works against Cloudflare R2 and moto."""

    def __init__(
        self,
        bucket: str,
        *,
        client: Any | None = None,
        endpoint_url: str | None = None,
        region: str = "auto",
    ) -> None:
        self.bucket = bucket
        if client is None:
            import boto3

            self.client = boto3.client(
                "s3",
                region_name=region,
                endpoint_url=endpoint_url or os.environ.get("S3_ENDPOINT_URL"),
                aws_access_key_id=os.environ.get("S3_ACCESS_KEY_ID", "test"),
                aws_secret_access_key=os.environ.get("S3_SECRET_ACCESS_KEY", "test"),
            )
        else:
            self.client = client

    def create_multipart(self, key: str, content_type: str) -> str:
        out = self.client.create_multipart_upload(
            Bucket=self.bucket, Key=key, ContentType=content_type
        )
        upload_id = out["UploadId"]
        if not isinstance(upload_id, str):
            raise RuntimeError("missing upload id")
        return upload_id

    def upload_part(self, key: str, upload_id: str, part_number: int, body: bytes) -> str:
        out = self.client.upload_part(
            Bucket=self.bucket,
            Key=key,
            UploadId=upload_id,
            PartNumber=part_number,
            Body=body,
        )
        etag = out["ETag"]
        if not isinstance(etag, str):
            raise RuntimeError("missing etag")
        return etag

    def complete_multipart(
        self, key: str, upload_id: str, parts: list[tuple[int, str]]
    ) -> None:
        self.client.complete_multipart_upload(
            Bucket=self.bucket,
            Key=key,
            UploadId=upload_id,
            MultipartUpload={
                "Parts": [{"PartNumber": number, "ETag": etag} for number, etag in parts]
            },
        )

    def abort_multipart(self, key: str, upload_id: str) -> None:
        self.client.abort_multipart_upload(Bucket=self.bucket, Key=key, UploadId=upload_id)

    def get_bytes(self, key: str) -> bytes:
        out = self.client.get_object(Bucket=self.bucket, Key=key)
        body = out["Body"].read()
        if not isinstance(body, bytes):
            raise RuntimeError("object body was not bytes")
        return body

    def delete(self, key: str) -> None:
        self.client.delete_object(Bucket=self.bucket, Key=key)

    def presign_get(self, key: str, expires_s: int = 3600) -> str:
        url = self.client.generate_presigned_url(
            "get_object",
            Params={"Bucket": self.bucket, "Key": key},
            ExpiresIn=expires_s,
        )
        if not isinstance(url, str):
            raise RuntimeError("presign did not return a url")
        return url
