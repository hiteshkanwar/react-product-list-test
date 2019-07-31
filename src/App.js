import React, { Component } from 'react';
import Products from './products';

class App extends Component{
    constructor(props) {
        super(props);
        this.productsSort = this.productsSort.bind(this);
        this.state = {
            size: false,
            price: false,
            id: false,      
        }
    }
    productsSort(event){
        if(event.target.value === "size")
        {
            this.setState({size: true, price: false, id: false})
        }else if(event.target.value === "price"){
            this.setState({size: false, price: true, id: false})
        }
        else if(event.target.value === "id"){
            this.setState({size: false, price: false, id: true})
        }
    }

   render(){
      return(
         <div className="container">
             <div className="row">
                 <select onChange={this.productsSort}>
                     <option>Sort By</option>
                     <option value="size">Size</option>
                     <option value="price">Price</option>
                     <option value="id">ID</option>
                 </select>
             </div>
            <Products  size={this.state.size} price={this.state.price} id={this.state.id}/>
        </div>
      );
   }
}
export default App;