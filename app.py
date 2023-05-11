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


@app.route("/pcp/<country_name>/<year>")
def pcp(country_name, year):
    df_pcp = df_clean.copy()
    df_pcp = df_pcp[df_pcp['start_year'] == int(year)][['iyear', 'country_txt', 'city', 'gname', 'attacktype1_txt', 'targtype1_txt', 'targsubtype1_txt', 'weaptype1_txt']]
    df_pcp = df_pcp[df_pcp['country_txt'] == country_name]
    df_pcp = df_pcp[df_pcp['city'] != 'Unknown']
    df_pcp = df_pcp[df_pcp['attacktype1_txt'] != 'Unknown']
    df_pcp = df_pcp[df_pcp['gname'] != 'Unknown']
    df_pcp = df_pcp[df_pcp['targtype1_txt'] != 'Unknown']
    df_pcp = df_pcp[df_pcp['targsubtype1_txt'] != 'Unknown']
    df_pcp = df_pcp[df_pcp['weaptype1_txt'] != 'Unknown']
    num_points = min(60, len(df_pcp))
    df_pcp = df_pcp.iloc[:num_points]
    df_pcp = df_pcp.rename(columns={'country_txt': 'Country', 'attacktype1_txt': 'Attack Type', 'city': 'City', 'gname': 'Group Name', 'targtype1_txt': 'Target Type', 'targsubtype1_txt': 'Target Subtype', 'weaptype1_txt': 'Weapon Type'})
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

@app.route("/lineplot/<country_name>/<year>")
def lineplot(country_name, year):
    df_lp = df_clean.copy()
    df_lp = df_lp[['iyear', 'country_txt', 'nkilled', 'nwounded', 'start_year']]
    df_lp = df_lp[df_lp['country_txt'] == country_name]
    df_lp = df_lp[df_lp['start_year'] == int(year)]
    df_lp = df_lp.drop(['start_year', 'country_txt'], axis = 1)
    df_lp_agg = df_lp.groupby(['iyear']).sum()
    df_lp_agg = df_lp_agg.reset_index()
    df_lp_agg = df_lp_agg.rename(columns={'iyear': 'Year', 'nkilled': 'Number Killed', 'nwounded': 'Number Wounded'})
    result = list(df_lp_agg.T.to_dict().values())
    return jsonify(result)

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


@app.route("/pie/<country_name>/<year>")
def pie(country_name, year):
    df_pie = df_clean.copy()
    df_pie = df_pie[['attacktype1_txt', 'start_year', 'country_txt']]
    df_pie = df_pie[df_pie['start_year'] == int(year)]
    df_pie = df_pie[df_pie['country_txt'] == country_name]
    df_pie = df_pie.drop(['country_txt'], axis=1)
    df_pie_agg = df_pie.groupby(['attacktype1_txt']).count()
    total = df_pie_agg['start_year'].sum()
    df_pie_agg = (df_pie_agg / total) * 100
    df_pie_agg = df_pie_agg.reset_index()
    df_pie_agg = df_pie_agg.rename(columns={'attacktype1_txt': 'Attack Type', 'start_year': 'Percentage'})
    df_pie_agg['Percentage'] = df_pie_agg['Percentage'].apply(int)
    result = list(df_pie_agg.T.to_dict().values())
    return jsonify(result)


if __name__ == '__main__':
    app.run()