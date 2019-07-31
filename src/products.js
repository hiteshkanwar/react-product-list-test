import React, { Component } from 'react';
import Api from '../server/routes.json';
import Idle from 'react-idle';
import { PushSpinner } from "react-spinners-kit";
import axios from 'axios';
import { dateFormat }from './dateFormat';
const PATH = 'http://localhost:3000';
const LIMIT = 20

class Products extends Component{
    constructor(props) {
        super(props);
        this.fetchProducts = this.fetchProducts.bind(this);
        this.isBottom = this.isBottom.bind(this);
        this.listenScrollEvent = this.listenScrollEvent.bind(this);
        this.preloadProducts = this.preloadProducts.bind(this);
        this.state = {
            endOfcatalogues: "",
            height: window.innerHeight,
            products: [],
            page: 1,
            scroll: 0,
            scrollLength: 0,
            loading: true,
        }
    }

    componentWillMount()
    {
        this.fetchProducts(this.state.page, null);
    }

    componentWillReceiveProps(nextProps){
        console.log('receive',nextProps)
        this.setState({ scroll: 0})
        this.setState({ page:  1})
        if (nextProps.size === true)
        {
            this.fetchProducts(1, "size");
        }
        else if (nextProps.price === true)
        {
            this.fetchProducts(1, "price");
        }
        else if(nextProps.id === true)
        {
            this.fetchProducts(1, "id");
        }
    }

    componentDidMount() {
        window.addEventListener('scroll', this.listenScrollEvent);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.listenScrollEvent);
    }

    fetchProducts(page, sort_by){  
        this.state.scrollLength === 1 && this.setState({scrollLength: 0})
        const obj = (sort_by === "size" ?  JSON.parse('{"sort":"size"}') :  (sort_by === 'price') ? JSON.parse('{"sort":"price"}') :  JSON.parse('{"sort":"id"}') )
        axios.get(PATH + '/api/products?' + '_page='+ page + '&_limit='  + LIMIT + '&'+ '_sort=' + obj.sort)
          .then(response => {
            response.data.length === 0 && this.setState({endOfcatalogues: "End of Catalogues"})
            const products = this.state.scroll === 0 ?  response.data : this.state.products.concat(response.data);
            this.setState({ products: products })
        })
        .catch(error => {
            console.log(error);
        });
    }

    isBottom(el) {
        return el.getBoundingClientRect().bottom <= (window.innerHeight*0.75);
    }

    listenScrollEvent() {
        const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
        const body = document.body;
        const html = document.documentElement;
        const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
        const windowBottom = windowHeight + window.pageYOffset;
        if (windowBottom >= (docHeight)*0.99) {
            if(this.state.scrollLength === 0)
            {
                const sort_by = (this.props.size === true) ? "size" : (this.props.price === true) ? "price" : (this.props.id === true) ? "id" : null 
                this.setState({ scroll: this.state.scroll + 1 })
                this.setState({scrollLength: 1})
                this.setState({ page: this.state.page + 1})
                this.fetchProducts(this.state.page, sort_by);
            }
        } 
        else{
           console.log('scrolling without reaching bottom')
        }
    
    }

    preloadProducts(){
        console.log('preload')
        const page  =  this.state.page + 1
        const sort_by = (this.props.size === true) ? "size" : (this.props.price === true) ? "price" : (this.props.id === true) ? "id" : null 
        this.setState({ page: this.state.page + 1})
        this.setState({ scroll: this.state.scroll + 1 })
        this.fetchProducts(page, sort_by);
    }
    
    render(){
        const { loading } = this.state;
        return(
             <div className="row product-lists" ref= "products">
                 <Idle 
                  timeout={2000}
                  onChange={({ idle}) => {
                        if (idle) {
                          this.preloadProducts()
                        }
                 }}/>
                {this.state.products && this.state.products.map((product, index) => {
                    return (<div className="col-sm-4" key={index}>
                                <div className="products">
                                    <span>Id:</span>{product.id}
                                    <div>
                                        <span>Price:</span> ${product.price/100}
                                    </div>
                                    <div>
                                        <span>Size:</span> {product.size}
                                    </div>
                                    <div className="face rounded-circle">
                                        <span className="facesBx" style={{width: 50 + product.size, height: 50 + product.size}}>{product.face}</span>
                                    </div>
                                    <div>
                                        <span>Date:</span> {dateFormat(product.date)}
                                    </div>
                                </div>
                              </div>
                        )
                })}
                {this.state.endOfcatalogues === "" ?
                    <PushSpinner
                        size={30}
                        color="#686769"
                        loading={loading}
                    />
                    :
                    this.state.endOfcatalogues 
                }
            </div>
        );
   }
}
export default Products;
