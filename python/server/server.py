from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/get', methods=['GET'])
def get_json():
    data = {
        'message': 'get test',
        'status': 'success'
    }
    return jsonify(data)

@app.route('/post', methods=['POST'])
def receive_json():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'message': 'No JSON received!', 'status': 'failure'}), 400

        print(f"Received JSON: {data}")
        response = {
            'message': 'JSON received successfully!',
            'received': data
        }
        return jsonify(response)

    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}', 'status': 'failure'}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
