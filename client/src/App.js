import logo from './logo.svg';
import React, {useState, useEffect} from 'react';
import Editor from './components/Editor';
import './App.css';


function App() {
  const [code, setCode] = useState('#include <iostream>\nusing namespace std;\nint main() {\n\t// your code goes here\n\treturn 0;\n}');
  const [results, setResults] = useState('');
  const [lang, setLang] = useState('C++');
  const [theme, setTheme] = useState('default');
  const [mode, setMode] = useState('clike')
  return (
    <>
      <div className="pane top-pane">
        <Editor
          value={code}
          onChange={setCode}
          onClick={setResults}
          lang = {lang}
          onLangChange ={setLang}
          theme={theme}
          onThemeChange ={setTheme}
          mode = {mode}
          onModeChange={setMode}
        />
      </div>
      <div className="pane">
        <iframe
          srcDoc={results}
          title="output"
          sandbox="allow-scripts"
          frameBorder="0"
          width="100%"
          height="100%"/>
      </div>
    </>
  );
}

export default App;
