publish:
    # 1. blow up the last deploy directory
    # I do this just to make sure I'm publishing the right build.
    # I never want to publish something that isn't ready.
    rm -rf deploy
    
    # 2. run hugo
    # This is straight forward, the only custom flag I use is to tell
    # hugo to publish into the `deploy` directory.
    hugo -d deploy
    
    # 3. cd into deploy, set up some temp envvars and run s3 sync
    # cd into deploy
    # set AWS_PROFILE so that the the aws-cli can authenticate as correct user
    # stash an md5 hash for cache busting
    # finally call aws
    #cd deploy; CACHE=`date | md5` aws s3 sync . s3://www.mattandreko.com --sse "AES256" --region us-east-1 --endpoint-url=https://s3.us-east-1.amazonaws.com

    aws s3 sync ./deploy s3://www.mattandreko.com --delete
    aws cloudfront create-invalidation --distribution-id E1QD8P7E5EC8R0 --paths "/*"
