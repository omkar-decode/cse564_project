#!/usr/bin/env python3
# -*- coding: utf-8 -*-


from flask import Flask, render_template,request, jsonify
from flask_cors import CORS
import random
import pandas as pd
app = Flask(__name__)
CORS(app)

df_clean = pd.read_csv('data/terrorism_data_clean.csv', index_col=False)


@app.route('/dashboard', methods = ['GET','POST'])
def dashboard():
    return render_template('dashboard.html')


@app.route("/spiderChart/<country_name>")
def spiderChart(country_name):
    df_sc = df_clean.copy()
    df_sc = df_sc.loc[df_sc['country_txt'].astype(str) == str(country_name)].iloc[0]
    # print(df_sc)
    
    cost_columns = ['Cost of fruits', 
        'Cost of vegetables',
        'Cost of starchy staples',
        'Cost of animal-source foods',
        'Cost of legumes, nuts and seeds',
        'Cost of oils and fats']

    df_sc = df_sc[cost_columns] * 30
    df_sc = df_sc.to_frame()
    df_sc['axis'] = df_sc.index
    df_sc['id'] = [country_name] * 6
    df_sc = df_sc.rename(columns = {df_sc.columns[0]: "value"})
    result = list(df_sc.T.to_dict().values())
    return jsonify(result)


@app.route("/pcp/<country_name>/<year>")
def pcp(country_name, year):
    df_pcp = df_clean.copy()
    df_pcp = df_pcp[df_pcp['start_year'] == int(year)][['iyear', 'country_txt', 'city', 'gname', 'attacktype1_txt', 'targtype1_txt', 'targsubtype1_txt', 'weaptype1_txt']]
    df_pcp = df_pcp[df_pcp['country_txt'] == country_name]
    result = list(df_pcp.T.to_dict().values())
    return jsonify(result)


# @app.route("/linePlot/<prop>/<prop2>")
# def linePlot(prop,prop2):
#     country_name = str(prop)
#     column_name = str(prop2)
#     df = df_clean.copy()
#     if country_name != 'world':
#         df = df.loc[df['Country'].astype(str) == str(country_name)]
#     age_counts = pd.DataFrame(df[column_name].value_counts().reset_index().values, columns=[column_name, "frequency"])
#     age_counts = age_counts.sort_index(axis=0, ascending=True)
#     age_counts = age_counts.sort_values(by=[column_name])
#     result = list(age_counts.T.to_dict().values())
#     return jsonify(result)


@app.route("/wc/<country_name>/<year>")
def wc(country_name, year):
    df_wc = df_clean.copy()
    df_wc = df_wc[df_wc['start_year'] == int(year)][['country_txt', 'targtype1_txt', 'iyear']]
    df_wc = df_wc[df_wc['country_txt'] == country_name]
    df_wc_agg = df_wc.groupby(['country_txt', 'targtype1_txt']).count()
    df_wc_agg = df_wc_agg.reset_index()
    df_wc_agg = df_wc_agg.drop(['country_txt'], axis = 1)
    df_wc_agg = df_wc_agg.rename(columns={'targtype1_txt': 'target_type', 'iyear': 'count'})
    result = list(df_wc_agg.T.to_dict().values())
    return jsonify(result)


if __name__ == '__main__':
    app.run()