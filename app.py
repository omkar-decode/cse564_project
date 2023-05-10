#!/usr/bin/env python3
# -*- coding: utf-8 -*-


from flask import Flask, render_template,request, jsonify
from flask_cors import CORS
import random
import pandas as pd
app = Flask(__name__)
CORS(app)

df_clean = pd.read_csv("data/data_final.csv")
df_other = pd.read_csv("data/fifa_processed_final.csv")


@app.route('/dashboard', methods = ['GET','POST'])
def dashboard():
    return render_template('dashboard.html')


@app.route("/spiderChart/<country_code>")
def spiderChart(country_code):
    df_sc = df_clean.copy()
    df_sc = df_sc.loc[df_sc['Country Code'].astype(str) == str(country_code)].iloc[0]
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
    df_sc['id'] = [country_code] * 6
    df_sc = df_sc.rename(columns = {df_sc.columns[0]: "value"})
    result = list(df_sc.T.to_dict().values())
    return jsonify(result)


@app.route("/pcp/<country_name>")
def pcp(country_name):
    prop = str(country_name)
    df_pcp = df_other.copy()
    if country_name!='world':
        df_pcp = df_pcp.loc[df_pcp['Country'].astype(str) == str(country_name)]
    df_pcp = df_pcp[['Club','Age','Value','Wage','Overall','Release Clause']]
    attr_cols = ['Age','Value','Wage','Overall','Release Clause']
    df_pcp_agg = df_pcp.groupby("Club").mean()
    df_pcp_agg['Wage'] = df_pcp_agg['Wage'].astype(str).astype(float)
    df_pcp_agg['Club'] = df_pcp_agg.index
    s = min(len(df_pcp_agg),22)
    df_pcp_agg = df_pcp_agg.sample(n = s)
    result = list(df_pcp_agg.T.to_dict().values())
    print(result)
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


if __name__ == '__main__':
    app.run()