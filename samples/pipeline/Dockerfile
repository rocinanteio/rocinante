FROM idalavye/pipeline

ENV api="http://localhost:3000"
ENV socket ="ws://localhost:4002"
ENV name="test-2"
ENV image="test-123"
ENV appPort=3000

CMD ["deno", "task", "start", "--api=$api --socket=$socket --name=$name --image=$image --appPort=$appPort"]
