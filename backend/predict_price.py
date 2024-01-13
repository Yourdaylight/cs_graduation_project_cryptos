# -*- coding: utf-8 -*-
# @Time    :2023/5/6 3:45
# @Author  :lzh
# @File    : predic_price.py
# @Software: PyCharm
import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
import json
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, LSTM

from datetime import timedelta


def lstm_predictor(coin):
  df = pd.read_csv('datasets/' + coin + '.csv')
  df = df.sort_values('time', ascending=True)
  data = df.filter(['price'])
  dataset = data.values

  # scale the data
  scaler = MinMaxScaler(feature_range=(0, 1))
  scaled_data = scaler.fit_transform(dataset)

  # create the training data set
  train_data = scaled_data
  x_train = []
  y_train = []

  for i in range(60, len(train_data)):
    x_train.append(train_data[i - 60:i, 0])
    y_train.append(train_data[i, 0])

  x_train, y_train = np.array(x_train), np.array(y_train)
  x_train = np.reshape(x_train, (x_train.shape[0], x_train.shape[1], 1))

  # build the LSTM model
  model = Sequential()
  model.add(LSTM(50, return_sequences=True, input_shape=(x_train.shape[1], 1)))
  model.add(LSTM(50, return_sequences=False))
  model.add(Dense(25))
  model.add(Dense(1))

  model.compile(optimizer='adam', loss='mean_squared_error')
  model.fit(x_train, y_train, batch_size=1, epochs=1)

  # Generate future data points (30 days)
  last_timestamp = df.iloc[-1]['time']
  future_data = train_data[-60:]
  predictions = []

  for i in range(30):
    future_data_scaled = np.reshape(future_data, (1, future_data.shape[0], 1))
    pred = model.predict(future_data_scaled)
    predictions.append(pred[0][0])
    future_data = np.append(future_data[1:], pred)
    last_timestamp += 86400000  # Add one day (24 hours * 60 minutes * 60 seconds * 1000 milliseconds)
    df = df.append({'time': last_timestamp, 'price': np.nan}, ignore_index=True)

  # Inverse transform the predictions
  predictions = scaler.inverse_transform(np.array(predictions).reshape(-1, 1))

  # Add predictions to the dataframe
  df.loc[df.index[-30:], 'price'] = predictions.flatten()
  # Add predictions to the dataframe
  df.loc[df.index[-30:], 'price'] = predictions.flatten()

  original_data = df[:-30][['time', 'price']].values.tolist()
  predict_data = df[-30:][['time', 'price']].values.tolist()

  result = {
    "original_data": original_data,
    "predict_data": predict_data
  }

  return result


if __name__ == '__main__':
  result_df = lstm_predictor('BTC')
  print(result_df)
