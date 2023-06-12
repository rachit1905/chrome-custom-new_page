import { useState } from "react";
import "./App.css";

function App() {
  let searchquery = "";
  let suggestcount = 0;
  const [suggestions, setSuggestions] = useState([]);

  function search(event) {
    // console.log(event.key);
    let searchBar = document.getElementById("searchBar");

    let children = document.getElementsByClassName('suggest')[0].children;
    for (let i = 0; i < children.length; i++) {
      children[i].style.border= "none" 
      
    }

    if (event.key === "Enter") {
      if (searchquery === "") return;
      window.location.href = "https://www.google.com/search?q=" + searchquery;
    } else if (event.keyCode === 40 || event.keyCode === 39) {
      // console.log("down");
      suggestcount <
      document.getElementsByClassName("suggest")[0].children.length - 1
        ? suggestcount++
        : (suggestcount = 0);
      document.getElementById("r" + suggestcount).style.border =
        "2px solid white";
      searchBar.value = document.getElementById("r" + suggestcount).innerText;
      searchquery = searchBar.value;
      return;
    } else if (event.keyCode === 38 || event.keyCode === 37) {
      console.log("up");
      suggestcount > 0
        ? suggestcount--
        : (suggestcount =
            document.getElementsByClassName("suggest")[0].children.length - 1);
      document.getElementById("r" + suggestcount).style.border =
        "2px solid white";
      searchBar.value = document.getElementById("r" + suggestcount).innerText;

      searchquery = searchBar.value;
      return;
    } else {
      searchquery = searchBar.value;
      document.getElementById("r0").innerText = searchquery;
    }


    if (searchquery.length > 0) {
      document.getElementById("icon").style.marginRight =
        visualViewport.width * 0.95 - visualViewport.height * 0.4;

      fetch(
        "https://google.com/complete/search?output=toolbar&q=" + searchquery
      ).then(async (res) => {
        res = await res.text();
        // console.log(res);
        let parser = new DOMParser();
        let xml = parser.parseFromString(res, "text/xml");
        document.getElementById("r0").innerText = searchquery;
        setSuggestions([]);
        for (
          let i = 0;
          i < 10 && xml.getElementsByTagName("suggestion")[i] != null;
          i++
        ) {
          setSuggestions((suggestions) => [
            ...suggestions,
            xml.getElementsByTagName("suggestion")[i].getAttribute("data"),
          ]);
        }
      });
    } else {
      document.getElementById("icon").style.marginRight = "0";
      setSuggestions([]);
    }
  }

  return (
    <div className="App">
      <input
        type="text"
        onKeyUp={(e) => search(e)}
        id="searchBar"
        onBlur={({ target }) => target.focus()}
        autoComplete="off"
        autoFocus={true}
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        enable-background="new 0 0 20 20"
        height="20"
        viewBox="0 0 20 20"
        width="20"
        id="icon"
      >
        <g>
          <g>
            <rect fill="none" height="20" width="20" />
          </g>
        </g>
        <g>
          <path d="M5.29,17.29L5.29,17.29c0.39,0.39,1.02,0.39,1.41,0l6.59-6.59c0.39-0.39,0.39-1.02,0-1.41L6.71,2.71 c-0.39-0.39-1.02-0.39-1.41,0l0,0C4.9,3.1,4.9,3.73,5.29,4.12L11.17,10l-5.88,5.88C4.9,16.27,4.9,16.9,5.29,17.29z" />
        </g>
      </svg>
      <div className="suggest">
        <div id="r0"></div>
        {suggestions.map((suggest, i) => {
          console.log(suggest);
          return <div id={"r" + (i + 1)}>{suggest}</div>;
        })}
      </div>
    </div>
  );
}

export default App;
