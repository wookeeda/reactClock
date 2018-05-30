import React, { Component } from 'react';
import './App.css';




// ver 1. if-else
function Time(props) {
  if (props.is12h) {
    return <Time12H time={props.time} />;
  } else {
    return <Time24H time={props.time} />;
  }
}

function Time24H(props) {
  let time = props.time;
  return (
    <h2>{`${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`}</h2>
  );
}

function Time12H(props) {
  let time = props.time;
  return (
    <h2>{`${time.getHours().toString() !== '12' ? time.getHours() % 12 : 12}:${time.getMinutes()}:${time.getSeconds()}`}</h2>
  );
}

function Title(props) {
  return (
    <h1>{props.title}</h1>
  )
}

function AlarmInfo(props) {
  if (props.alarmList.length === 0) {
    return null;
  }
  return (
    <p>총 {props.alarmList.length}개 알람이 등록 되었습니다.</p>
  );
}

function AlarmList(props) {
  const alarmList = props.alarmList;
  const li = alarmList.map((alarm) => {
    return (
      <li key={alarm.timerID}>{alarm.timerID} : {alarm.time.toLocaleTimeString()}</li>
    );
  });
  return (
    <ul>{li}</ul>
  )
}

class AlarmInput extends Component {
  constructor(props) {
    super(props);
    this.controlledHandler = this.controlledHandler.bind(this);
    this.onAddAlarm = this.onAddAlarm.bind(this);
  }

  controlledHandler(e) {
    this.props.onControlledHandler(e);
  }

  onAddAlarm(e) {
    this.props.onAddAlarm(e);
  }

  render() {
    return (
      <div>
        {this.props.isInput ?
          <input type="number" name="alarmTime" onChange={this.controlledHandler} value={this.props.alarmTime} />
          :
          <select name="alarmTime" value={this.props.alarmTime} onChange={this.controlledHandler}>
            <option value="5">5초 후</option>
            <option value="10">10초 후</option>
            <option value="15">15초 후</option>
          </select>
        }
        <br />
        <textarea name="alarmText" onChange={this.controlledHandler} value={this.props.alarmText} /><br />
        <button onClick={this.onAddAlarm}>알람 등록</button>
      </div>
    )
  }
}

class Clock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: new Date(),
      is12h: true,
      alarmList: [],
      alarmTime: 5,
      alarmText: '',
      isInput: false,
      alarmInfo: {},
      IsAlarmShow: false
    };
    this.alarmHandler = this.alarmHandler.bind(this);
    this.controlledHandler = this.controlledHandler.bind(this);
  }

  tick() {
    this.setState({
      time: new Date()
    });
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  alarmHandler(e) {
    let timerID = setTimeout(() => {
      this.setState((prevState, props) => {
        let alarmList = prevState.alarmList.slice();
        let spliceIndex = 0;
        let alarmInfo = {};
        for (let item of alarmList) {
          if (item['timerID'] === timerID) {
            spliceIndex = alarmList.indexOf(item);
            alarmInfo = item;
          }
        }
        alarmList.splice(spliceIndex, 1);
        return { alarmList: alarmList, alarmInfo: alarmInfo, IsAlarmShow: true };
      });
    }, this.state.alarmTime * 1000);

    this.setState((prevState, props) => {
      let alarmList = prevState.alarmList.slice();
      var alarmTime = new Date();
      alarmTime.setSeconds(alarmTime.getSeconds() + prevState.alarmTime);
      alarmList.push({
        timerID: timerID,
        time: alarmTime,
        text: prevState.alarmText
      });
      return { alarmList: alarmList };
    });
  }

  controlledHandler(e) {
    const target = e.target;
    const name = target.name;
    let value = '';
    if (name === 'is12h' || name === 'isInput' || name === 'IsAlarmShow') {
      value = target.value === 'true';
    } else if (name === 'alarmTime') {
      value = Number(target.value.replace(/[^0-9]/g, ''));
    } else {
      value = target.value;
    }
    this.setState({
      [name]: value
    });
  }

  // ver 3. 3항연산자 conditional ternary operator
  render() {
    return (
      <div>
        <Title title={this.props.title} />
        <label><input type="radio" name="is12h" value="true" onChange={this.controlledHandler} checked={this.state.is12h} />12시간제</label>
        <label><input type="radio" name="is12h" value="false" onChange={this.controlledHandler} checked={!this.state.is12h} />24시간제</label>
        <Time time={this.state.time} is12h={this.state.is12h} />
        <label><input type="radio" name="isInput" value="true" onChange={this.controlledHandler} checked={this.state.isInput} />input</label>
        <label><input type="radio" name="isInput" value="false" onChange={this.controlledHandler} checked={!this.state.isInput} />select</label>
        <br />
        <AlarmInput isInput={this.state.isInput} alarmTime={this.state.alarmTime} alarmText={this.state.alarmText} onControlledHandler={this.controlledHandler} onAddAlarm={this.alarmHandler} />
        <AlarmInfo alarmList={this.state.alarmList} />
        <AlarmList alarmList={this.state.alarmList} />
        {this.state.IsAlarmShow === true &&
          <Dialog
            title="알람"
            contents={<p><b>{this.state.alarmInfo.time.toString()}</b>
              : <i>{this.state.alarmInfo.text}</i></p>}>
            <button name="IsAlarmShow" value="false" onClick={this.controlledHandler}>확인</button>
          </Dialog>
        }
      </div>
    )
  }
}

// export default Clock;
class App extends Component {
  render() {
    return (
      <div>
        <Clock title="ReactJS Clock" />
        <hr />
        {/* <TextGroup /> */}
        <hr />
        {/* <DialogGroup type="confirm1" title="group title" contents="group contents" /> */}
      </div>
    );
  }
}
export default App;

function TextLength(props) {
  return <p>Text length : {props.text.length} </p>;
}


class TextInput extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.props.onTextChange(e.target.value);
  }


  render() {
    var textCase = this.props.textCase;
    var text = this.props.text;
    return (
      <fieldset>
        <legend>{textCase} Area</legend>
        <input value={text} onChange={this.handleChange} />
      </fieldset>
    );
  }
}

// eslint-disable-next-line
class TextGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textCase: "",
      text: ""
    };

    this.handleLower = this.handleLower.bind(this);
    this.handleUpper = this.handleUpper.bind(this);
  }

  handleLower(text) {
    this.setState({
      textCase: "lower",
      text: text
    });
  }

  handleUpper(text) {
    this.setState({
      textCase: "upper",
      text: text
    })
  }

  render() {
    var text = this.state.text;
    var lowerText = toLowerText(text);
    var upperText = toUpperText(text);

    return (
      <div>
        <TextInput textCase="lower" text={lowerText} onTextChange={this.handleLower} />
        <TextInput textCase="upper" text={upperText} onTextChange={this.handleUpper} />
        <TextLength text={text} />
      </div>
    )
  }
}

function toUpperText(text) {
  return text.toUpperCase();
}

function toLowerText(text) {
  return text.toLowerCase();
}

// eslint-disable-next-line
function DialogTitle(props) {
  return (
    <i>{props.title}</i>
  );
}

// eslint-disable-next-line
function Contents(props) {
  return (
    <i>{props.contents}</i>
  );
}

class Dialog extends Component {
  // eslint-disable-next-line
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h1>{this.props.title}</h1>
        <div>{this.props.contents}</div>
        {this.props.children}
      </div>
    );
  }
}

class AlertDialog extends Component {
  constructor(props) {
    super(props);
    this.handleCancel = this.handleCancel.bind(this);
  }

  handleCancel(e) {
    alert("ALERT CANCEL");
  }

  render() {
    return (
      <Dialog
        title={this.props.title}
        contents={this.props.contents}>
        <button onClick={this.handleCancel}>취소</button>
      </Dialog>
    )
  }
}

class ConfirmDialog extends Component {
  constructor(props) {
    super(props);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
  }

  handleCancel(e) {
    alert("Confirm Cancel");
  }

  handleConfirm(e) {
    alert("Confirm OK");
  }

  render() {
    return (
      <Dialog
        title={this.props.title}
        contents={this.props.contents}>
        <button onClick={this.handleCancel}>취소</button>
        <button onClick={this.handleConfirm}>확인</button>
      </Dialog>
    )
  }
}

// eslint-disable-next-line
class DialogGroup extends Component {
  render() {
    let type = this.props.type;
    let title = this.props.title;
    let contents = this.props.contents;
    let dialog = null;

    if (type === 'confirm') {
      dialog = (
        <ConfirmDialog
          title={title}
          contents={contents} />
      );
    } else {
      dialog = (
        <AlertDialog
          title={title}
          contents={contents} />
      )
    }
    return dialog;
  }
}