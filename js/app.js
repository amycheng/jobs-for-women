'use strict';
console.log("loading app");

  var getRandom = (arr)=>{
    let len = arr.length-1;
    let num = Math.floor(Math.random() * (len + 1)) + 0;
    return num;
  };


  var generateTweet = (title)=>{
    var baseUrl = "https://twitter.com/intent/tweet?text=";
    var sharedUrl = "&url="+encodeURIComponent(window.location);
    var text="A%20job%20for%20women:"+title;

    return baseUrl+text+sharedUrl;
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


      window.location="#"+newCard;

      this.setState({
        current:_data[newCard],
        index: newCard,
        permalink: window.location.href,
      });

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
            index: rando,
            permalink: window.location
          });
          document.addEventListener('resetCard',_this.clickHandler,false);
        }
      };
      request.open("GET", url, true);
      request.send();
    },
    render: function(){
      return (
        <div>
          <p className="loader" data-show={this.state.showLoader}>Loading</p>
          <Card klick={this.clickHandler} data={this.state.current} permalink={this.state.permalink} />
        </div>
      );
    }
  });

  var Card = React.createClass({
    render: function(){
      return (
        <div className="card">
         <h1 className="callout">{this.props.data.job}</h1>
         <img onClick={this.props.klick} className = "card-image" src={this.props.data.image} alt={this.props.data.job}/>
         <p><a href={this.props.data.url} target="_blank">View details</a> on the Metropolitan Museum of Art web site.</p>
         <p><a href={this.props.permalink}>Permalink</a></p>
         <Tweet job={this.props.data.job} />
        </div>
      );
    }
  });

  var Reset = React.createClass({
    clickHandler: function(){
      var ev = new Event('resetCard');
      document.dispatchEvent(ev);
    },
    render: function(){
      return (
        <button onClick={this.clickHandler}>Discover another "job"</button>
      );
    }
  })

  var Tweet = React.createClass({
    url: function(){
      return encodeURIComponent(window.location.href);
    },
    render: function(){
      return (
       <a href={'https://twitter.com/intent/tweet?text=A job for women: '+this.props.job+'&url='+this.url()}>Tweet this.</a>
      );
    }
  })

  ReactDOM.render(
    <App />,
    document.getElementById('content')
  );

  ReactDOM.render(
    <Reset />,
    document.getElementById('reset')
  );
