from flask import Flask, render_template, request, redirect, jsonify, url_for
import json
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from sklearn.decomposition import PCA
from sklearn.cluster import KMeans
from sklearn.manifold import MDS
import numpy as np
import math
import pandas as pd
import pprint

data = pd.read_csv('./data/Lab2_Processed_fifa22.csv')
remove_categorical = ['Name']
data.drop(columns="Name", axis=1, inplace=True)

cols=data.columns.tolist()
for i in cols:
  if data[i].dtype == "int64":
    data[i] = data[i].astype(float)

features = data.columns
data_npy = data.to_numpy()

std = StandardScaler().fit_transform(data)
num_clusters = 4 # we get this optimal k value from elbow plot

pca = PCA(n_components=(len(features)))
principalComponents = pca.fit_transform(std)

min_max_sklr = MinMaxScaler(feature_range=(-1,1))
norm_principalComponents_data = min_max_sklr.fit_transform(X = principalComponents)

eigen_values = pca.explained_variance_

#eigen_values
li = []
for i in features:
  li.append(i)

PCA_components = pd.DataFrame(principalComponents)
inertias = []
for k in range(1, 16):
    model = KMeans(n_clusters=k)
    model.fit(PCA_components)
    inertias.append(model.inertia_)
# print(inertias)

###lab2 part2
embeddings = MDS(n_components=2, random_state=0)
std_scaler = StandardScaler()
for_mds = std_scaler.fit_transform(data_npy)
kmeans = KMeans(n_clusters=num_clusters, random_state=0).fit(data_npy)
transformed = embeddings.fit_transform(for_mds)


def elbow():
    elbow_dict = {}
    for i in range(len(inertias)):
        elbow_dict[i+1] = inertias[i]
    # print(elbow_dict[1])
    elbow_dict = {'inertia': elbow_dict}
    #print(elbow_dict)
    return elbow_dict
elbow()        

def generate_scree_data(): 
    scree_plot = {}
    eigen_total = sum(eigen_values)
    variance_percentage = []
    for i in  eigen_values:
        variance_percentage.append((i/eigen_total)*100)
    
    cumulative_variance = []
    temp = 0
    for i in variance_percentage:
        temp += i
        cumulative_variance.append(temp)
 
    for i in range(0, len(eigen_values)):
        scree_plot[i+1] = {"variance_percentage" : variance_percentage[i], "cumulative_variance": cumulative_variance[i]}
    return scree_plot

def get_top_pca():
    feature_contri = {}
    count = 0
    for i, j, k in zip(li, pca.components_[0], pca.components_[1]):
        feature_contri[count] = {}
        feature_contri[count]["name"] = i
        feature_contri[count]["pc1"] = j
        feature_contri[count]["pc2"] = k
        count += 1
        
    top_pca = norm_principalComponents_data[:,:2]
    plot_pca = {}
    for i in range(0, len(top_pca)):
        plot_pca[i] = {}
        plot_pca[i]['pc1'] = top_pca[i, 0]
        plot_pca[i]['pc2'] = top_pca[i, 1]
        
    return feature_contri, plot_pca

def get_top_four_features(di = 3):
    squared_value = pca.components_[:di] ** 2

    features_dict = {}
    for i in range(0, len(squared_value[0])):
        total = 0
        for j in range(0, len(squared_value)):
            total += squared_value[j][i]
        features_dict[li[i]] = total

    sorted_features_dict = [k for k, v in sorted(features_dict.items(), key=lambda item: item[1])]
    sorted_features_dict = sorted_features_dict[::-1]
    best_four_features = sorted_features_dict[:4]
    
    values_best_best_four_features = {}
    for i in best_four_features:
        values_best_best_four_features[i] = features_dict[i]

    return values_best_best_four_features

def get_top_four_scatter_data(di = 4):
    imp_features = get_top_four_features(di)
    imp_features_arr = [i for i in imp_features]
    np_data = data[imp_features_arr].to_numpy()

    cluster_features = [i for i in imp_features]
    featured_data = data[cluster_features]
    kmeans = KMeans(n_clusters=4, random_state=0).fit(data)

    send_data = {}
    for i in range(0, np_data.shape[0]):
        send_data[i] = {}
        for j in range(0, len(imp_features_arr)):
            send_data[i][imp_features_arr[j]] = np_data[i][j]
        send_data[i]['label'] = int(kmeans.labels_[i])
    return send_data

###########lab2 part 2##################
def get_mds():
    mds_data = []
    for i in range(transformed.shape[0]):
        mds_data.append({'dim1': transformed[i][0], 'dim2': transformed[i][1], 'label': int(kmeans.labels_[i])})

    return mds_data

def get_pcp():
    pcp_data = []
    for i in range(data_npy.shape[0]):
        entry = {}
        for j in range(data_npy.shape[1]):
            entry[features[j]] = data_npy[i][j]

        entry['label'] = int(kmeans.labels_[i])
        pcp_data.append(entry)

    for_mds_attr = np.abs(1 - data.corr().to_numpy())
    embeddings_corr = MDS(n_components=2, dissimilarity='precomputed',random_state=0)
    transformed2 = embeddings_corr.fit_transform(for_mds_attr)
    
    mds_attr_data = []
    for i in range(transformed2.shape[0]):
        mds_attr_data.append({'dim1': transformed2[i][0], 'dim2': transformed2[i][1], "feature": features[i]})

    return pcp_data, mds_attr_data

#####################################
app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/init_home", methods=["POST", "GET"])
def init_home():
    if request.method == "POST":
        # raw_data = generate_scree_data()
        # data_json = json.dumps(raw_data, indent=2)
        data = {'chart_data':"fool"}
        return data
    else:
        print("ERROR")

@app.route("/screeplot", methods=["POST", "GET"])
def id_index():
    if request.method == "POST":
        raw_data = generate_scree_data()
        data = {'chart_data':raw_data}
        #print(data)
        return (data)
    else:
        print("ERROR")

@app.route("/id_index", methods=["POST", "GET"])
def screeplot():
    if request.method == "POST":
        data_back = request.form['data']
        #print(data_back)
        four_features = get_top_four_features(int(data_back))
        # print("a")
        new_four_features = dict(sorted(four_features.items(), key=lambda item: item[1], reverse=True))
        # print(new_four_features)
        # print("b")
        chart_data = get_top_four_scatter_data(int(data_back))
        #pprint.pprint(chart_data)
        data = {'feature_data': new_four_features, 'chart_data': chart_data}
        
        # li = []
        # li.append([new_four_features])
        # li.append([chart_data])
        # print(li[0])
        #print("abb")
        # pprint.pprint(data["feature_data"])
        return data
    else:
        print("ERROR")

@app.route("/biplot", methods=["POST", "GET"])
def call_biplot():
    if request.method == "POST":
        feature_contri, plot_pca = get_top_pca()
        data = {'feature_contri' : feature_contri,'plot_pca' :plot_pca }
        return data
    else:
        print("ERROR")

@app.route("/elbow", methods=["POST", "GET"])
def call_elbow():
    if request.method == "POST":
        elbow_data = elbow()
        #print(elbow_data)
        # data = {'feature_contri' : feature_contri,'plot_pca' :plot_pca }
        return elbow_data
    else:
        print("ERROR")


##################
@app.route("/mds", methods=["POST", "GET"])
def call_mds():
    if request.method == "POST":
        mds_data = get_mds()
        data = {"chart_data": mds_data}
        #print(data)
        return data
    else:
        print("ERROR")

@app.route("/pcp", methods=["POST", "GET"])
def call_pcp():
    if request.method == "POST":
        pcp_data, mds_attr_data= get_pcp()
        data = {"chart_data": pcp_data, "chart_attr_data":mds_attr_data}
        #print(data)
        return data
    else:
        print("ERROR")

if __name__ == "__main__":
    app.run(debug=True)