import time
from celery import Celery 
from celery.utils.log import get_task_logger
import subprocess

logger = get_task_logger(__name__)
app = Celery('tasks', broker='redis://redis:6379/0', backend='redis://redis:6379/0')

@app.task()
def run_and_compile(lang, code):
    logger.info('Compiling code')
    if(lang == 'C++'):
        file1 = open("main.cpp", "w")
        file1.write(code)
        file1.close()
        cmd = "g++ -o main main.cpp && timeout 30 ./main"
    elif(lang == "Java"):
        file1 = open("main.java", "w")
        file1.write(code)
        file1.close()
        cmd = "timeout 30 javac main.java"
    elif(lang == "JavaScript"):
        file1 = open("main.js", "w")
        file1.write(code)
        file1.close()
        cmd = "timeout 30 node main.js"
    elif(lang == "C"):
        file1 = open("main.c", "w")
        file1.write(code)
        file1.close()
        cmd = "gcc -o main main.c && timeout 30 ./main"
    else:
        file1 = open("main.py", "w")
        file1.write(code)
        file1.close()
        cmd = "timeout 30 python3 main.py"

    logger.info('Compilation complete')
    start = time.time()
    stdout = subprocess.getoutput(cmd)
    end = time.time()

    return stdout + " ("+ str(end - start) + " sec(s))"
"""
@app.task()
def cancel_code(id):
    update_state(state='FAILURE')
"""
