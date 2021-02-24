from flask import Flask, request, jsonify
from flask_restful import Resource, Api, request
from celery import Celery
from flask_cors import CORS, cross_origin
import os

app = Flask(__name__)
api = Api(app)
port = int(os.environ.get("PORT", 5000))
CORS(app)
simple_app = Celery('worker', broker='redis://redis:6379/0', backend='redis://redis:6379/0')

class CompileCode(Resource):
    def post(self):
        app.logger.info("Invoking Method ")
        #                        queue name in task folder.function name
        code = request.json
        print(code)
        print(code['lang'])
        print(code['value'])
        r = simple_app.send_task('tasks.run_and_compile', kwargs={'lang': code["lang"], 'code': code["value"]})
        #result = simple_app.AsyncResult(r.id).result
        app.logger.info(r.backend)
        return r.id
class CancelCode(Resource):
    @cross_origin()
    def post(self):
        task_id = request.json['id']
        print(task_id)
        simple_app.control.revoke(task_id)#, terminate=True)
        #r = simple_app.send_task('tasks.cancel_Code', kwargs={'id': task_id})
        return "Canceled"

class Status(Resource):
    def get(self, task_id):
        status = simple_app.AsyncResult(task_id, app=simple_app)
        print("Invoking Method ")
        return "Status of the Task " + str(status.state)

class Result(Resource):
    def get(self, task_id):
        result = simple_app.AsyncResult(task_id).result
        return "Result (Runtime):" + str(result)
api.add_resource(CompileCode, '/simple_start_task')
api.add_resource(CancelCode, '/cancel')
api.add_resource(Status, '/simple_task_status/<task_id>')
api.add_resource(Result, '/simple_task_result/<task_id>')
"""
@app.route('/simple_start_task', methods=['GET', 'POST'])
def call_method():


@app.route('/cancel', methods=['GET', 'POST'])
#@cross_origin()
def task_cancel():


@app.route('/simple_task_status/<task_id>')
def get_status(task_id):


@app.route('/simple_task_result/<task_id>')
def task_result(task_id):
"""


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0',port=port)