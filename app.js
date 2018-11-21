import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'


let SearchBox = styled.input`
  border-radius: 20px;
  background-color: #000;
  color: #fff;
  font-size: 1.2rem;
  border: 0px;
  height: 40px;
  outline: none;
  padding: 0 10px;
`;

let Navigation = styled.header`
  display: flex;
  padding: 0px 10%;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0px 2px 25px rgba(0,0,0,0.16);
  height: 100px;
`;

let Configs = styled.div`
  display: flex;
  padding: 0px 10%;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0px 2px 25px rgba(0,0,0,0.16);
  height: 100px;
`;

let PageSizeBox = styled.select`
  margin: 3px;
  background-color: #FFF;
  color: #000;
  flex-grow:.5;
  text-align: center
  padding: 0px,5px,0px.5px;
  font-size: 1.2rem;
  border: 0px;
  height: 40px;
`;

let SpaceDiv = styled.div`
  flex-grow:2;
`;

let SortTypeBox = styled.select`
  margin: 3px;
  border-radius: 5px;
  background-color: #FFF;
  flex-grow:.5;
  color: #000;
  padding: 0px,5px,0px.5px;
  font-size: 1.2rem;
  border: 0px;
  height: 40px;
`;

let NewsContainer = styled.main`
  background-color: red;
  padding: 20px 10%;
`;

let NewsItem = styled.div`
  background-color: #fff;
  border: 2px solid #E5E9F2;
  min-height: 150px;
  margin: 20px 0px;
  border-radius: 4px;
  display: flex;
  padding: 10px;
`;

let NewsText = styled.div`
  padding-left: 14px;
  position: relative;
`;

let NewsVote = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
`;

let DateTime = styled.time`
  position: absolute;
  bottom: 0px;
  color: #399DF2;
  font-family: sans-serif;
`;

class News extends Component {

    constructor() {
        super();

        this.state = {
            news: [],
            pageSize: 5,
            sortType: 0,
            searchValue: ''
        };
        this.getNews()

    }

    getNews() {
        fetch(`https://newsapi.org/v2/everything?q=${this.state.searchValue || 'iraq'}&apiKey=978d6c3818ff431b8c210ae86550fb1f`)
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                data.articles.forEach(item => {
                    item.votes = localStorage.getItem(item.title) || 0;
                });
                if (this.state.sortType == 0) {
                    this.setState({
                        news: data.articles.slice(0, this.state.pageSize).sort((o1, o2) => o1.votes - o2.votes)
                    })
                } else if (this.state.sortType == 1) {
                    this.setState({
                        news: data.articles.slice(0, this.state.pageSize).sort((o1, o2) =>
                            this.parseDate(o1.publishedAt) - this.parseDate(o2.publishedAt))
                    })
                }
                else if (this.state.sortType == 2) {
                    this.setState({
                        news: data.articles.slice(0, this.state.pageSize).sort((o1, o2) => {
                            if (o1.title < o2.title) {
                                return -1;
                            }
                            if (o1.title > o2.title) {
                                return 1;
                            }
                            return 0;
                        })
                    })
                }
                else {
                    this.setState({
                        news: data.articles.slice(0, this.state.pageSize)
                    })
                }


            })
    }

    parseDate(dateTime) {
        let date = dateTime.split('T')[0];
        let time = dateTime.split('T')[1].replace('Z', '');
        let dateArr = date.split('-');
        let timeArr = time.split(':');
        let ts = new Date(dateArr[0], dateArr[1], dateArr[2], timeArr[0], timeArr[1], timeArr[2], 0).getTime();
        console.log(ts);
        return ts;
    }

    onInputChange(event) {
        this.setState({
            searchValue: event.target.value
        })
    }

    onKeyUp(event) {
        if (event.key == 'Enter') {
            this.getNews();
            this.setState({
                searchValue: ''
            })
        }
    }

    render() {
        return (
            <React.Fragment>
                <Navigation>
                    <img width="150px;" src={require('./assets/logo.svg')}/>
                    <SearchBox
                        onChange={this.onInputChange.bind(this)}
                        onKeyUp={this.onKeyUp.bind(this)}
                        value={this.state.searchValue} placeholder="search term"/>
                </Navigation>
                <Configs>
                    <h3>Page Size </h3>
                    <PageSizeBox placeholder="page size" onChange={event => {
                        console.log(event.target.value);
                        this.setState({
                            pageSize: event.target.value
                        });
                        this.getNews();

                    }}>
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={15}>15</option>
                        <option value={20}>20</option>
                    </PageSizeBox>
                    <SpaceDiv/>
                    <h3>Sort Type </h3>
                    <SortTypeBox placeholder="sort type" onChange={event => {
                        this.setState({
                            sortType: event.target.value
                        });
                        this.getNews();
                    }}>
                        <option value={0}>Default</option>
                        <option value={1}>Date</option>
                        <option value={2}>Title</option>
                    </SortTypeBox>
                </Configs>
                <NewsContainer>
                    {
                        this.state.news.map((item, i) => {
                            return (
                                <NewsItem key={i}>
                                    <img width="124px;" height="124px" src={item.urlToImage}/>
                                    <NewsText>
                                        <h1>{item.title}</h1>
                                        <p>{item.description}</p>
                                        <DateTime>{item.publishedAt}</DateTime>
                                    </NewsText>
                                    <NewsVote>
                                        <img width="13" height="13"
                                             src={require('./assets/upvote.svg')}
                                             onClick={() => {
                                                 item.votes += 1;
                                                 localStorage.setItem(item.title, item.votes);
                                                 this.setState({
                                                     news: this.state.news
                                                 })
                                             }}/>
                                        <div id="counter">{item.votes}</div>
                                        <img width="13" height="13"
                                             src={require('./assets/downvote.svg')} onClick={() => {
                                            item.votes -= 1;
                                            localStorage.setItem(item.title, item.votes);
                                            this.setState({
                                                news: this.state.news
                                            })
                                        }}/>
                                    </NewsVote>
                                </NewsItem>
                            )
                        })
                    }
                </NewsContainer>
            </React.Fragment>
        )
    }
}

function App() {
    return <div>
        <News/>
    </div>
}

ReactDOM.render(
    <App/>
    , document.getElementById('root'))
