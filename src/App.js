import React, { Component } from 'react';
import { Button, Form, Container, Row } from "react-bootstrap";
import web3 from './web3';
import ipfs from './ipfs';
import contract from './contract';

const ipfsUrl = "https://gateway.ipfs.io/ipfs/";

class App extends Component {
 
  state = {
    ipfsHash:null,
    imgUrl: null,
    listImgs: null,
    buffer:'',
    ethAddress:'',
    transactionHash:''
  };

  async componentWillMount() {
    await this.loadBlockchainData()
  }  

  loadImages = async() => {
    const auxListImgs = await contract.methods.listHashes().call();
    let listImgs = [];

    for (var i in auxListImgs) {
      console.log(auxListImgs[i]);
      listImgs.push(ipfsUrl+auxListImgs[i]);      
    };   
    console.log("listImgs\n", listImgs);
    this.setState({listImgs});
  }

  async loadBlockchainData() {
    const ethAddress= contract.options.address;
    this.setState({ethAddress});

    if (await contract.methods.ipfsHashesCount().call() > 0) {
      const hash = await contract.methods.getHash().call();
      this.setState({ipfsHash: hash});

      this.loadImages();
    }
  }

  captureFile =(event) => {
    event.stopPropagation()
    event.preventDefault()
    const file = event.target.files[0]
    let reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => this.convertToBuffer(reader)    
  };

  convertToBuffer = async(reader) => {
    //file is converted to a buffer for upload to IPFS
    const buffer = await Buffer.from(reader.result);
    this.setState({buffer});
  };

  onSubmit = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();    
    console.log('Sending from Metamask account: ' + accounts[0]);

    //save document to IPFS,return its hash#, and set hash# to state
    //https://github.com/ipfs/interface-ipfs-core/blob/master/SPEC/FILES.md#add 
    await ipfs.add(this.state.buffer, (err, ipfsHash) => {
      console.log(err,ipfsHash);
      this.setState({ ipfsHash:ipfsHash[0].hash });

      //https://web3js.readthedocs.io/en/1.0/web3-eth-contract.html#methods-mymethod-send
      contract.methods.addHash(this.state.ipfsHash).send({
        from: accounts[0] 
      }, (error, transactionHash) => {
        console.log(transactionHash);
        this.setState({transactionHash});        
      }).then( () => {
        this.setState({imgUrl: ipfsUrl+this.state.ipfsHash});
        this.loadImages();
      });
    })
  };

  render() {
      
    return (
      <div className="App">
        <Container>
          <header className="App-header">
            <h1>Photo album stored on IPFS</h1>
            <p> Ethereum and IPFS with Create React App</p>
          </header>
          <hr />

          <p>Ethereum Contract Address: {this.state.ethAddress}</p>

          <h4> Choose file to send to IPFS </h4> 

          <Form onSubmit={this.onSubmit}>
            <input type = "file" onChange = {this.captureFile} />
            <br/>
            <Button type="submit"> Send </Button>
          </Form>

          <br/>
          {this.state.transactionHash && 
            <p>Transaction hash: {this.state.transactionHash} </p>
          }
          <hr/>

          <Row>
            {this.state.listImgs && this.state.listImgs.map((image, index) => 
              <div key={index} className="col-sm-6 col-md-4 col-lg-3">
                <a href={image} target="_blank">
                  <img src={image} className="img-thumbnail" />
                </a>                
              </div>
            )}
          </Row>           

          <br/>
          <hr/>
          <p>Last IPFS Hash stored on Eth Contract: {this.state.ipfsHash}</p>
          {this.state.imgUrl && <img src={this.state.imgUrl} className="img-fluid" />}
          
        </Container>
        
      </div>
    );
  }
}

export default App;