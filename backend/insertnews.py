from pymongo import MongoClient

# 创建一个连接到 MongoDB 的客户端
client = MongoClient("mongodb://localhost:27017/")

# 选择 crypto_db 数据库
db = client["crypto_db"]

# 选择 news 集合
news_collection = db["news"]

def insert_news(id: int, title: str, author: str, date: str, content: str):
    # 创建一个新闻对象
    news_item = {
        "_id": id,
        "title": title,
        "author": author,
        "date": date,
        "content": content
    }

    # 尝试插入新闻数据
    try:
        result = news_collection.insert_one(news_item)
        print(f"Inserted news item with ID {result.inserted_id}")
    except Exception as e:
        print(f"Error inserting news item: {e}")


# insert_news(1, "Sample News Title", "John Doe", "2023-04-21", "This is a sample news content.")
# insert_news(2, "What’s next for EU’s crypto industry as European Parliament passes MiCA?", "Veronika Rinecker", "2023-04-20", "On April 20, the European Parliament voted to pass the Markets in Crypto-Assets (MiCA) regulation, the European Union’s main legislative proposal to oversee the crypto industry in its member countries. The MiCA regulation is a significant development for the crypto industry in the European Union. Prior to MiCA, crypto companies had to comply with 27 different regulatory frameworks across the EU member states, with Germany or France being costly and burdensome, for example.Under MiCA, however, EU-wide regulations will apply, allowing companies to operate throughout the entire EU crypto market with a MiCA license granted in one country. This will increase the competitiveness of EU startups and may result in them gaining market share from unregulated competitors.")
insert_news(3, "DeFi driving zkSync growth as 1inch deploys on Ethereum layer-2 scaling platform", "Grace Ema", "2023-04-19", " 1inch Network is the latest decentralized Finance protocol to deploy on Ethereum layer-2 scaling platform zkSync Era.Decentralized finance protocol 1inch has deployed its aggregation and limit order protocols on Ethereum layer-2 scaling solution zkSync Era to tap into faster and cheaper transactions.1inch Network is the latest of a host of Ethereum-based platforms and services deploying on the zero-knowledge proof (zk-proof) based scaling platform. Uniswap, SushiSwap, Maker and Curve Finance are also preparing to launch on the zk-proof roll-up zkSync Era.1inch Network co-founder Sergej Kunz highlighted the promise of the layer-2 solution as his platform joins a handful of first-movers to integrate with the zk-proof powered protocol")
