import React, {useState, useEffect} from 'react';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/theme/blackboard.css';
import 'codemirror/theme/erlang-dark.css';
import 'codemirror/theme/rubyblue.css';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/python/python';
import 'codemirror/mode/clike/clike';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/css/css';
import axios from 'axios';
import { Controlled as ControlledEditor} from 'react-codemirror2';

function Editor(props) {
    const source = axios.CancelToken.source()
    const cancelToken = source.token;
    let running = false;
    const source_template={
        "C" : "#include <stdio.h>\nint main(void) {\n\t// your code goes here\n\treturn 0;\n}",
        "C++" : "#include <iostream>\nusing namespace std;\nint main() {\n\t// your code goes here\n\treturn 0;\n}",
        "C++11" : "#include <iostream>\nusing namespace std;\nint main() {\n\t// your code goes here\n\treturn 0;\n}",
        "Java" : "/* package whatever; // don't place package name! */\nimport java.util.*;\nimport java.lang.*;\nimport java.io.*;\n\
      /* Name of the class has to be \"Main\" only if the class is public. */\nclass Ideone{\n\t\
      public static void main (String[] args) throws java.lang.Exception{\n\t\t// your code goes here\n\t}\n}",
        "JavaScript":"// your code goes here",
        "Python":"# your code goes here"
    };
    
    const {
        value,
        onChange,
        onClick,
        onLangChange,
        lang,
        theme,
        onThemeChange,
        mode,
        onModeChange,
    } = props;
    let cancel = false;
    const [runState, setRunState] = useState('Compile and Run');
    const [id, setId] = useState('');
    
    function handleReset(){
        onChange(source_template[lang]);
    }
    function handleThemeChange(e){
        onThemeChange(e.target.value);
    }
    function handleLangChange(e){
        //handleChange('')
        //console.log(e.target.value)
        //handleChange(source_template[e.target.value])
        let v = source_template[e.target.value]
        onChange(v)
        //console.log(e.target.value);
        onLangChange(e.target.value);
        if(e.target.value == "C++" || e.target.value == "C" || e.target.value == "Java")
            onModeChange("clike")
        else
            onModeChange(e.target.value.toLowerCase());
    }
    function handleChange(editor, data,value){
        //console.log(typeof value);
        onChange(value)
    }
    /*
    async function checkStatus(id){
        const resp = await axios.get(`http://localhost:5000/simple_task_status/${id}`).then((res)=>{
            return res.data
        });
        return resp;
    }
   */
    async function showResults(idVal){
        /*
        if(cancel == true){
            return "Terminated"
        }else{

            let resp = await axios.get(`http://localhost:5000/simple_task_result/${idVal}`, {cancelToken}).then((res) =>{
                if(cancel != true)
                    return res.data;
                else{
                    source.cancel('Terminated');
                    return "Terminated"
                }
            });
            console.log("pass")
            console.log(typeof resp)
            console.log(resp)
            if(resp !== "Result (Runtime):None"){
                onClick(resp);
                setRunState("Compile and Run");
                cancel = false
                return resp
            }
            
            return showResults(idVal);
        }
        */
        if(running == false){
            return "Cancelled";
        }
        else{
            const rep = await axios.get(`https://powerful-castle-77162.herokuapp.com/simple_task_status/${idVal}`).then((res)=>{
                return res.data
            });
            console.log(rep)
            if(rep == "Status of the Task PENDING")
                showResults(idVal);            
            let resp = await axios.get(`https://powerful-castle-77162.herokuapp.com/simple_task_result/${idVal}`).then((res) =>{
                console.log(res.data);
                return res.data;
            });
            console.log(resp);
            onClick(resp);
            if(rep != "Status of the Task PENDING")
                handleRunChange();
        }
    }
    function handleRunChange(){
        if(runState == "Compile and Run"){
            setRunState("Cancel")
        }
        else{
            setRunState("Compile and Run")
        }
        running = !running
    }
 
    async function handleClick(){
        // Send code

        if(runState == "Cancel"){
            //if((typeof id) === 'string'){                
                console.log(runState);
                console.log(`About to cancel: ${id}`);
                if(id !== "undefined"){
                    await axios.post('https://powerful-castle-77162.herokuapp.com/cancel', {id}).then((res)=>{
                        return res.data;
                    });
                    cancel = true
                    handleRunChange();
                }
           // }
        }
        else{
            handleRunChange();
            let idVal
            idVal = await axios.post('https://powerful-castle-77162.herokuapp.com/simple_start_task', {value, lang}).then((res) =>{
                //console.log(res.data);
                
                return res.data;
            });
            setId(idVal);
            console.log(`Starting: ${idVal}`);
            console.log(id);
            
            showResults(idVal)
        }

    }
    return (
        <div className="editor-container">
            <div className="editor-title">
                Code editor
                <button onClick={handleReset}>
                    Reset Code
                </button>
                <select onChange={handleLangChange}>
                    <option value="C++">C++</option>
                    <option value="Python">Python</option>
                    <option value="Java">Java</option>
                    <option value="C">C</option>
                    <option value="JavaScript">JavaScript</option>
                </select>
                <select onChange={handleThemeChange}>
                    <option value="default">Default</option>
                    <option value="material">Material</option>
                    <option value="blackboard">Blackboard</option>
                    <option value="erlang-dark">Erlang-dark</option>
                    <option value="rubyblue">Rubyblue</option>
                </select>
                <button onClick={handleClick}>{runState}</button>
            </div>
            <ControlledEditor
                onBeforeChange={handleChange}
                value={value}
                className="code-mirror-wrapper"
                options={{
                    lineWrapping: true,
                    lint: true,
                    mode: mode,
                    theme: theme,//'material',
                    lineNumbers: true,
                }}
                />


            
        </div>
    );
}

export default Editor;
