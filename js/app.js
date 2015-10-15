'use strict';
console.log("loading app");
/*
TODOS:
  - use arrow syntax for lulz
  - add share to twitter button
*/

  var getRandom = (arr)=>{
    let len = arr.length-1;
    let num = Math.floor(Math.random() * (len + 1)) + 0;
    return num;
  };

  var App = React.createClass({
    getInitialState: function() {
      return {
        showLoader: true,
        data:[],
        current:{},
        index: 0
      };
    },
    clickHandler: function(){
      var _data = this.state.data;
      var newCard = getRandom(this.state.data);

      this.setState({
        current:_data[newCard],
        index: newCard
      });

      window.location="#"+newCard;
      var event = new Event('ping');
      document.dispatchEvent(event);
    },
    componentDidMount: function(){
      //window.location.hash
      var _this=this;
      console.log("app component mounting");

      var request = new XMLHttpRequest();
      var url = "api.json";

      request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
          var _data = JSON.parse(request.response);
          var rando;

          if (window.location.hash) {
            rando = parseInt(window.location.hash.substr(1));
          }else{
            rando = getRandom(_data.data);
            window.location="#"+rando;
          };
          _this.setState({data:_data.data,
            showLoader:false,
            current:_data.data[rando],
            index: rando
          });
          document.addEventListener('ping',function(){alert("ping")},false);
        }
      }
      request.open("GET", url, true);
      request.send();
    },
    render: function(){
      return (
        <div>
          <p className="loader" data-show={this.state.showLoader}>Loading</p>
          <button onClick={this.clickHandler}>Discover another "job"</button>
          <Card klick={this.clickHandler} data={this.state.current} />
        </div>
      );
    }
  });

  var Card = React.createClass({
    render: function(){
      return (
        <div className="card">
         <h1>{this.props.data.job}</h1>
         <img onClick={this.props.klick} className = "card-image" src={this.props.data.image} alt={this.props.data.job}/>
         <p><a href={this.props.data.url} target="_blank">View details</a> on the Metropolitan Museum of Art web site.</p>
        </div>
      );
    }
  });

  ReactDOM.render(
    <App />,
    document.getElementById('content')
  );
