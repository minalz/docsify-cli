1.pip install -r require.txt

2.docker pull phidata/pgvector:16

docker volume create pgvolume

docker run -itd -e POSTGRES_DB=ai -e POSTGRES_USER=ai -e POSTGRES_PASSWORD=ai -e PGDATA=/var/lib/postgresql/data/pgdata -v pgvolume:/var/lib/postgresql/data -p 5532:5432 --name pgvector phidata/pgvector:16

3.GROQ_API_KEY https://console.groq.com/keys 配置好自己的key 就可以用70B的了 -- 但是网址打不开

4.ollama run nomic-embed-text 知识库向量化

5.streamlit run app.py