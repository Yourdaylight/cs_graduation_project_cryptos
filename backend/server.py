import json
import bcrypt
from bson import json_util
from flask import Flask, request, jsonify, session
from pymongo import MongoClient
from flask_cors import CORS
import requests
from predict_price import lstm_predictor

# 连接到 MongoDB 服务器
mongo_client = MongoClient("mongodb://localhost:27017/")

# 选择数据库和集合
db_name = "crypto_db"
collection_name = "users"
collection_name2 = "news"
collection_name3 = "crypto"
collection_name4 = "dialog"
collection_name5 = "post"
db = mongo_client[db_name]
collection = db[collection_name]
collection2 = db[collection_name2]
collection3 = db[collection_name3]
collection4 = db[collection_name4]
collection5 = db[collection_name5]
# 如果集合为空，则插入初始化记录
if collection.estimated_document_count() == 0:
  initial_record = {"usr": "admin", "pwd": "admin"}
  collection.insert_one(initial_record)

# 初始化 Flask 应用
app = Flask(__name__)
CORS(app)


def need_proxy():
  url = "https://www.google.com"
  try:
    response = requests.get(url, timeout=1)
    # 检查响应状态是否正常（状态码 200）
    if response.status_code == 200:
      return 1
    else:
      return 0
  except Exception as e:
    # print(f"Error accessing Google: {e}")
    return 0


# 路由 - 注册
@app.route('/signin', methods=['POST'])
def signin():
  user_data = request.get_json()
  username = user_data.get('usr')
  password = user_data.get('pwd')
  print(username, password)

  if username and password:
    # 检查用户名是否已存在
    existing_user = collection.find_one({"usr": username})
    if existing_user:
      return jsonify({"status": "fail", "message": "Username already exists."})

    # 哈希密码并插入新用户
    password = password.encode('utf-8')
    hashed_password = bcrypt.hashpw(password, bcrypt.gensalt())
    new_user = {"usr": username, "pwd": hashed_password}
    collection.insert_one(new_user)
    return jsonify({"status": "success", "message": "User registered successfully."})
  else:
    return jsonify({"status": "fail", "message": "Username or password missing."})


# 路由 - 登录
@app.route('/login', methods=['POST'])
def login():
  user_data = request.get_json()
  username = user_data.get('usr')
  password = user_data.get('pwd')

  if username and password:
    # 查找用户
    existing_user = collection.find_one({"usr": username})
    if existing_user:
      # 验证密码
      password = password.encode('utf-8')
      if bcrypt.checkpw(password, existing_user['pwd']):
        return jsonify({"status": "success", "message": "Login successful."})
      else:
        return jsonify({"status": "fail", "message": "Incorrect password."})
    else:
      return jsonify({"status": "fail", "message": "User not found."})
  else:
    return jsonify({"status": "fail", "message": "Username or password missing."})


@app.route('/card-details/<card_id>', methods=['GET'])
def get_card_details(card_id):
  card = collection2.find_one({'_id': int(card_id)})
  # print(card)
  if card:
    card_dict = json_util.loads(json_util.dumps(card))  # 将结果转换为 dict 类型
    card_dict.pop('_id')  # 删除 '_id' 键，因为它无法被 JSON 序列化
    return jsonify(card_dict)
  else:
    return jsonify({'error': 'Card not found'}), 404


@app.route('/dialog', methods=['GET'])
def get_dialogue():
  dialogue_data = collection4.find_one()
  if dialogue_data:
    dialogue_data.pop('_id')
    return dialogue_data
  else:
    return jsonify({"error": "Data not found"}), 404


def fetch_market_data():
  url = "https://www.okx.com/priapi/v5/market/mult-cup-tickers?t=1682245351541&ccys=BTC,ETH,USDT,BNB,USDC,XRP,ADA,OKB,DOGE,MATIC,SOL,DOT,LTC,SHIB,TRX,AVAX,DAI,WBTC,UNI,LINK,TON,LEO,ATOM,XMR,ETC,XLM,ICP,BCH,FIL,TUSD"
  # 设置代理
  proxies = {
    "http": "http://127.0.0.1:10809",
    "https": "http://127.0.0.1:10809",
  }
  res = need_proxy()
  try:
    if res:
      response = requests.get(url)
    else:
      response = requests.get(url, proxies=proxies)
    if response.status_code == 200:
      return response.json()
    else:
      print(f"Error fetching market data: {response.status_code}")
      return 0
  except Exception as e:
    print(f"Error fetching market data: {e}")
    return 0


@app.route('/market', methods=['GET'])
def get_market_data():
  market_data = fetch_market_data()
  # print(market_data)
  return jsonify(market_data['data'][:9])


def fetch_market_data2(coin):
  if coin == 'USDT':
    url = 'https://www.okx.com/priapi/v5/market/index-candles?t=1682316274275&instId=USDT-USD&limit=1000&bar=1D'
  else:
    url = "https://www.okx.com/priapi/v5/market/candles?t=1682307645213&instId=" + coin + "-USDT&limit=1000&bar=1D"

  # 设置代理
  proxies = {
    "http": "http://127.0.0.1:10809",
    "https": "http://127.0.0.1:10809",
  }
  res = need_proxy()
  try:
    if res:
      response = requests.get(url)
    else:
      response = requests.get(url, proxies=proxies)
    if response.status_code == 200:
      return response.json()
    else:
      print(f"Error fetching market data: {response.status_code}")
      return 0
  except Exception as e:
    print(f"Error fetching market data: {e}")
    return 0


@app.route('/cryptos', methods=['POST'])
def get_cryptos():
  data = request.get_json()
  coin = data.get('coin')
  market_data = fetch_market_data2(coin)
  # 　save the data to local,filename is coin+timestap
  filename = "datasets/" + coin + ".csv"
  with open(filename, 'w') as f:
    # 保存每个元素的第一个和第六个元素，即时间和收盘价存为csv文件
    f.write('time,price\n')
    for i in market_data['data']:
      f.write(str(i[0]) + ',' + str(i[5]) + '\n')

  return jsonify(market_data['data'][::-1])


@app.route('/modify', methods=['POST'])
def modify():
  user_data = request.get_json()
  username = user_data.get('usr')
  password = user_data.get('pwd')
  if username and password:
    # 查找用户
    existing_user = collection.find_one({"usr": username})
    if existing_user:
      # 哈希新密码并更新用户密码
      new_password = password.encode('utf-8')
      hashed_new_password = bcrypt.hashpw(new_password, bcrypt.gensalt())
      collection.update_one({"usr": username}, {"$set": {"pwd": hashed_new_password}})
      return jsonify({"status": "success", "message": "Password updated successfully."})
    else:
      return jsonify({"status": "fail", "message": "Username not found."})
  else:
    return jsonify({"status": "fail", "message": "Username, or new password missing."})


@app.route('/dele', methods=['POST'])
def dele():
  user_data = request.get_json()
  username = user_data.get('usr')
  if username:
    # 查找用户
    existing_user = collection.find_one({"usr": username})
    if existing_user:
      collection.delete_one({"usr": username})
      return jsonify({"status": "success", "message": "User deleted successfully."})
    else:
      return jsonify({"status": "fail", "message": "Username not found."})
  else:
    return jsonify({"status": "fail", "message": "Username  missing."})


# post
@app.route('/uploadpost', methods=['POST'])
def upload_post():
  post_data = request.get_json()
  title = post_data.get('title')
  content = post_data.get('content')
  date = post_data.get('date')
  summary = post_data.get('summary')
  likes = post_data.get('likes')
  comments = post_data.get('comments')
  if title and content and date and summary:
    new_post = {
      "title": title,
      "content": content,
      "date": date,
      "summary": summary,
      "likes": likes,
      "comments": comments
    }
    collection5.insert_one(new_post)
    print(new_post)
    return jsonify({"status": "success", "message": "Post saved successfully."})
  else:
    return jsonify({"status": "fail", "message": "Post data missing or incomplete."})


@app.route('/getposts', methods=['GET'])
def get_all_posts():
  try:
    posts = list(collection5.find({}))
    for post in posts:
      post['_id'] = str(post['_id'])
    return jsonify({"status": "success", "data": posts})
  except Exception as e:
    print(f"Error retrieving posts: {e}")
    return jsonify({"status": "fail", "message": "Error retrieving posts."})


@app.route('/updatelikes', methods=['POST'])
def updatelikes():
  post_data = request.get_json()
  posttitle = post_data.get('title')
  new_likes = post_data.get('likes')

  if posttitle and new_likes is not None:
    result = collection5.update_one({"title": posttitle}, {"$set": {"likes": new_likes}})
    if result.modified_count > 0:
      return jsonify({"status": "success", "message": "Post likes updated successfully."})
    else:
      return jsonify({"status": "fail", "message": "Post not found or likes not updated."})
  else:
    return jsonify({"status": "fail", "message": "Post title or new likes missing."})


@app.route('/updatecomments', methods=['POST'])
def updatecomments():
  post_data = request.get_json()
  posttitle = post_data.get('title')
  new_comments = post_data.get('comments')

  if posttitle and new_comments is not None:
    result = collection5.update_one({"title": posttitle}, {"$set": {"comments": new_comments}})
    if result.modified_count > 0:
      return jsonify({"status": "success", "message": "Post comments updated successfully."})
    else:
      return jsonify({"status": "fail", "message": "Post not found or comments not updated."})
  else:
    return jsonify({"status": "fail", "message": "Post title or new comments missing."})


@app.route('/fetch_data', methods=['POST'])
def fetch_data():
  data = request.json
  url = data['url']
  print(url)
  proxies = {
    "http": "http://127.0.0.1:10809",
    "https": "http://127.0.0.1:10809",
  }
  response = requests.get(url, proxies=proxies)
  xml_data = json.loads(response.text)
  return xml_data["data"]


@app.route('/fetch_data2', methods=['POST'])
def fetch_data2():
  data = request.json
  url = data['url']
  print(url)
  proxies = {
    "http": "http://127.0.0.1:10809",
    "https": "http://127.0.0.1:10809",
  }
  response = requests.get(url, proxies=proxies)
  xml_data = json.loads(response.text)

  return jsonify({"data": xml_data["data"]["introduce"]})

@app.route('/predict', methods=['POST'])
def predict():
  data = request.json
  coin = data['coin']
  return jsonify({"data": lstm_predictor(coin)})

if __name__ == '__main__':
  app.run(debug=True)
