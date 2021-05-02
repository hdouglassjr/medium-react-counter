import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';

/*
    Functions having parameters passed inside brackets {} indicate an object and its property name.
    i.e. {count} indicates an object with a property having a name 'count'
 */
function Counter({count}) {
    /*
        Remember that the return statement returns the UI this component builds, or creates when called, from the JSX.
        The other way to build a UI element is with React.CreateElement function directly.
     */
    return (
        <p className="mb2">
            Word count: {count}
        </p>
    );
}

function ProgressBar({completion}) {
    const percentage = completion * 100;
    return (
        <div className="mv2 flex flex-column">
            <label htmlFor="progress" className="mv2">
                Progress
            </label>
            <progress value={completion} id="progress" className="bn">
                {percentage}%
            </progress>
        </div>
    );
}
/*
    In order to update this.state.text whenever the user changes the textarea content we must:
    1. Pass an event handler to the <textarea> element
    2. Isolate the Editor function implementation so we can modify its internal element structure
       without affecting other components.
    3. The Parent component (in this case the WordCount component) is able to retrieve only the text
       within the <textarea> everytime the user types.  We do this by defining a prop on Editor named
       'onTextChanged' that exposes the changed text from the event.target.value property after each user event
       of changing the textarea input.  **onTextChanged being a property is exposed to any parent components, in
       this case, the Parent is WordCount that will use onTextChanged to update state for this.state.text when a user types.
    4. Create a custom event handler named 'handleChange' within the Editor to trap the onChange event from the <textarea> element
       and pass in the entire event object.
    NOTE:  The <textarea> element's onChange always returns the entire event object and leave you to decide on how/what to
    use for your code.  Generally, it's the value of the target element, like the text of the <textarea> and accessed
    like the following:  event.target.value
 */
function Editor({text, onTextChanged}) {
    function handleEditorChange(event){
        onTextChanged(event.target.value);
    }
    return (
        <div className="flex flex-column mv2">
            <label htmlFor="editor" className="mv2">
                Enter your text:
            </label>
            <textarea
                id="editor"
                onChange={handleEditorChange}
                value={text}/>
        </div>
    );
}

function countWords(text) {
    /*
    This is a utility function to determine words in a string with regex
     */
    return text ? text.match(/\w+/g).length : 0;
}

/*
 All React component classes must extend the React.Component class.
 React.Component defines setState. By extending React.Component,
 a class can access setState in turn.
 */
class WordCounter extends Component {
    constructor(props) {
        /*
        The JavaScript runtime calls constructor every time it creates a class instance.
        Inside constructor, this points to the new instance. Add super as the first line in constructor.
        When a class extends another, JavaScript forces you to call super before
        accessing this in the constructor. super calls the superclass constructor function
        to ensure that the superclass does the work it needs on the new object.
         */
        super(props);
        /*
        this.state.text starts as undefined, but we still need to render the word counter
        correctly before the user has typed something. We need to set a default value for this.state.text.
         */
        this.state = {text: 'Hello, Harry'};  // Default text on when WordCount class is instantiated

        /*
            Important:  We have an issue if you do not bind the handleTextChanged function in the constructor.
            Why?  The handelTextChanged method calls this.setState and recall that setState comes from the base
            class React.Component we extended our WordCounter to.  In JavaScript, this keyword changes meaning
            depending on context.  To make sure that this.setState inside handleTextChanged points to the
            setState function of WordCounter at the time when React calls handleTextChanged, you MUST bind the function
            to this in the constructor.  This tells the runtime to use the WordCounter's setState when managing state
            for any child components or state inside WordCounter itself.
        */
        this.handleTextChanged = this.handleTextChanged.bind(this);
        /* Note on above binding statement:
            'bind' returns a new function where 'this' always has the value it had when you called bind.
            In the constructor, this points to the newly created (instantiated) WordCounter instance,
            so now this.setState will be defined when React calls handleTextChanged.
         */
    }
    /*
        We define this method 'handleTextChanged' in this WordCounter component since this is the parent component
        we set up to handle all state and pass down to the children who require it and any updates to the children
        components of this parent bubble up to the parent to update this.state.
        NOTE: currentText represents the current text of the textarea element in Editor.
     */
    handleTextChanged(currentText){
        // This call to setState returns an object with its 'text' property set to the current updated text from Editor <textarea> element.
        // NOTE:  The arrow function passed in here is a 'pure function', meaning it should just return a NEW OBJECT without modifying existing variables.
        this.setState(()=> ({text: currentText}));
    }

    /*
        In a class component, the render function defines the UI.
        It returns a React.createElement call or the equivalent JSX.
     */
    render() {

        /*
        Props and state don’t get passed to the render function. Instead, they’re attached to the this variable.
        this is available in any function inside the class, so you can also access props and state outside
        the render function if you need them. Retrieve the text value from this.state and the
        targetWordCount prop from this.props with a destructuring assignment.
        Destructuring allows you to rapidly retrieve the object property values by enclosing
        the property name with braces. JavaScript then assigns the object property value to the
        variable with the same name as the property, so targetWordCount has the same value as this.props.targetWordCount,
        and text has the same value as this.state.text.
         */
        const {text} = this.state;  //Array destructure of state object for property 'text' defined in constructor
        const {targetWordCount} = this.props;  //Array destructure of the props object for property 'targetWordCount' passed in via tag <WordCount targetWordCount={10}/>
        const wordCount = countWords(text);
        const progress = wordCount / targetWordCount;
        return (
            //We wire the event handling this Parent component (WordCounter) to the child Editor
            //via the Editor's prop 'onTextChanged' event handler being assigned the WordCounter's 'handleTextChanged' event handler
            //in order for the parent WordCounter to update the state when the child's <textarea> state is changed by a user typing.
            <form className="measure pa4 sans-serif">
                <Editor
                    onTextChanged={this.handleTextChanged}
                    text={text}/>
                <div className="flex mt3">
                    <Counter count={wordCount}/>
                    <ProgressBar completion={progress}/>
                </div>
            </form>
        );
    }
}

ReactDOM.render(
    <WordCounter targetWordCount={10}/>,
    document.getElementById('root')
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
