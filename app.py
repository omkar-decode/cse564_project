#!/usr/bin/env python3
# -*- coding: utf-8 -*-


from flask import Flask, render_template,request, jsonify
from flask_cors import CORS
import random
import pandas as pd
app = Flask(__name__)
CORS(app)

df_clean = pd.read_csv("data/data_final.csv")


@app.route('/dashboard', methods = ['GET','POST'])
def dashboard():
    return render_template('dashboard.html')




@app.route("/spiderChart/<prop>")
def spiderChart(prop):
    df_sc = df_clean.copy()
    df_sc = df_sc.loc[df_sc['ID'].astype(str)== str(prop)]
    # print(df_sc)
    #define cols
    striking_cols = ['Finishing','Volleys','Penalties','ShotPower','LongShots','Positioning']
    dribbling_cols = ['Dribbling','Agility','Reactions','Balance','BallControl','Composure']
    passing_cols = ['Curve','Crossing','FKAccuracy','LongPassing','ShortPassing','Vision']
    defence_cols = ['HeadingAccuracy','Interceptions','Marking','StandingTackle','SlidingTackle']
    physical_cols = ['Aggression','Jumping','Stamina','Strength','SprintSpeed']
    gk_cols = ['GKDiving','GKHandling','GKKicking','GKPositioning','GKReflexes']
    df_sc['Striking'] = df_sc[striking_cols].astype(str).astype(float).mean(axis=1)
    df_sc['Dribbling Ability'] = df_sc[dribbling_cols].astype(str).astype(float).mean(axis=1)
    df_sc['Passing'] = df_sc[passing_cols].astype(str).astype(float).mean(axis=1)
    df_sc['Defending'] = df_sc[defence_cols].astype(str).astype(float).mean(axis=1)
    df_sc['Physical'] = df_sc[physical_cols].astype(str).astype(float).mean(axis=1)
    df_sc['Goalkeeping'] = df_sc[gk_cols].astype(str).astype(float).mean(axis=1)
    df_sc = df_sc[['Striking','Dribbling Ability','Passing','Defending','Physical','Goalkeeping']]
    df_sc_T = df_sc.T
    df_sc_T['axis'] = df_sc_T.index
    df_sc_T = df_sc_T.rename(columns = {df_sc_T.columns[0]: "value"})
    result = list(df_sc_T.T.to_dict().values())
    return jsonify(result)


@app.route("/pcp/<prop>")
def pcp(prop):
    prop = str(prop)
    df_pcp = df_clean.copy()
    if prop!='world':
        df_pcp = df_pcp.loc[df_pcp['Country'].astype(str) == str(prop)]
    df_pcp = df_pcp[['Club','Age','Value','Wage','Overall','Release Clause']]
    attr_cols = ['Age','Value','Wage','Overall','Release Clause']
    df_pcp_agg = df_pcp.groupby("Club").mean()
    df_pcp_agg['Wage'] = df_pcp_agg['Wage'].astype(str).astype(float)
    df_pcp_agg['Club'] = df_pcp_agg.index
    s = min(len(df_pcp_agg),22)
    df_pcp_agg = df_pcp_agg.sample(n = s)
    result = list(df_pcp_agg.T.to_dict().values())
    return jsonify(result)


@app.route("/linePlot/<prop>/<prop2>")
def linePlot(prop,prop2):
    country_name = str(prop)
    column_name = str(prop2)
    df = df_clean.copy()
    if country_name != 'world':
        df = df.loc[df['Country'].astype(str) == str(country_name)]
    age_counts = pd.DataFrame(df[column_name].value_counts().reset_index().values, columns=[column_name, "frequency"])
    age_counts = age_counts.sort_index(axis=0, ascending=True)
    age_counts = age_counts.sort_values(by=[column_name])
    result = list(age_counts.T.to_dict().values())
    return jsonify(result)


if __name__ == '__main__':
    app.run()