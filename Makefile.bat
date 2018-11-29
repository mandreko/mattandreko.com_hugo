rmdir /q /s deploy

hugo -d deploy

aws s3 sync ./deploy s3://www.mattandreko.com --delete

aws cloudfront create-invalidation --distribution-id E1QD8P7E5EC8R0 --paths "/*"

REM aws cloudfront wait invalidation-completed --distribution-id E1QD8P7E5EC8R0 --id $invalidation_id

rmdir /q /s deploy