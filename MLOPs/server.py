import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import pymongo
import pandas as pd
from dotenv import load_dotenv
import matplotlib.pyplot as plt
from langchain.agents.agent_types import AgentType
from langchain_experimental.agents.agent_toolkits import create_pandas_dataframe_agent
from langchain_google_genai import GoogleGenerativeAI

load_dotenv()

# MongoDB connection
client = pymongo.MongoClient("mongodb+srv://22bce315:tXYMXYZlQkq9RTFe@cluster0.modrs1h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client["test"]
collection = db["books"]
data = list(collection.find())
df = pd.DataFrame(data)




print(df.head())

# Initialize the LLM and agent
llm = GoogleGenerativeAI(model="gemini-pro", google_api_key="AIzaSyDMGiZds8QE2MquY0tm7N4qE4_zBUXOKM8")
llm2 = GoogleGenerativeAI(model="gemini-pro", google_api_key="AIzaSyBcBNW3moG8nFwpqCe7IiPAWqzMJx3WNK0")
agent = create_pandas_dataframe_agent(
    llm,
    df,
    allow_dangerous_code=True,
    verbose=True,
)

def ask(query):
    ans =  agent.invoke(query + "answer with help of description section in table")["output"]
    ans = llm2.invoke(ans + "expand with respect to the query" + query)
    return ans 

# Initialize Flask application
app = Flask(__name__)
CORS(app)  # Enable CORS for the entire app

@app.route('/ask', methods=['POST'])
def ask_endpoint():
    try:
        query = request.json.get('query')
        if not query:
            return jsonify({"error": "Query is required"}), 400
        
        response = ask(query)
        return jsonify({"response": response})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
