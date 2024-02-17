import React, { useState } from 'react'
import { triggerBase64Download, Base64Downloader } from 'common-base64-downloader-react';
import loading from './loading5.gif'

function Content() {

    const [product, setproduct] = useState({ description: "", price: "", quantity: "1", "tax-rate": 0 })
    const [customer, setcustomer] = useState({ name: "", mo_no: "" })
    const [product_arr, setarr] = useState([])
    const [flag, setflag] = useState(false)
    const [ok, setok] = useState(false)
    const onChange1 = (e) => {
        setproduct({ ...product, [e.target.name]: e.target.value })
    }
    const onChange2 = (e) => {
        setcustomer({ ...customer, [e.target.name]: e.target.value })
    }



    const [base64, setbase64] = useState("")


    var data1 = {
        "data": {

            "customize": {

            },
            "images": {

                "logo": "https://public.easyinvoice.cloud/img/logo_en_original.png",

                "background": ""
            },

            "sender": {
                "company": "Healthy Elite",
                "address": "55, Amipark Society, Kargil Chowk, Punagam",
                "zip": "395010",
                "city": "Surat",
                "country": "India"
            },

            "client": {
                "company": "",
                "address": "",
                "zip": "395010",
                "city": "Surat",
                "country": "India"
            },
            "information": {
                "number": "2021.0001",
                "date": "",
                "due-date": ""
            },

            "products": [],

            "bottom-notice": "Thanks for dealing with us",

            "settings": {
                "currency": "INR"
            },

            "translate": {

            }
        }
    }

    const handleAdd = () => {
        setok(false);
        product_arr.push(product);
        console.log("Handle Added", product_arr);
        setproduct({ description: "", quantity: "1", price: "", "tax-rate": 0 });
    }
    const handleClick = async (e) => {
        e.preventDefault();

        // client Info
        data1.data.client.company = customer.name;
        data1.data.client.address = customer.mo_no;

        // Date Info
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        today = dd + '/' + mm + '/' + yyyy;
        data1.data.information.date = today;
        data1.data.information['due-date'] = today;

        // products info

        data1.data.products = product_arr;

        setok(false)
        setflag(true);
       
        const response = await fetch("https://api.easyinvoice.cloud/v2/free/invoices", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data1)
        });
        
        setflag(false);
        setok(true);
        const json = await response.json()
        setarr([]);

        var pdf = "data:application/pdf;base64," + String(json.data.pdf);
        setbase64(pdf);
    }

    var count = 1;
    return (
        <div className='container mb-5'>
            <div className="row">
                <div className="col-md-5">
                    <h3 className='mt-5'>Welcome to Invoice Generator</h3>
                    <div className="mb-3 mt-5 ">
                        <label htmlFor="name" className="form-label">Customer Name</label>
                        <input type="text" className="form-control" id="name" name="name" placeholder="Customer" onChange={onChange2} value={customer.name} />
                    </div>
                    <div className="mb-3 ">
                        <label htmlFor="mo_no" className="form-label"> Mobile Number</label>
                        <input type="text" className="form-control" id="mo_no" name="mo_no" placeholder="xxxxxxxxxx" onChange={onChange2} value={customer.mo_no} />
                    </div>

                    <br />
                    <h5>Add Products to Invoice</h5>
                    <div className="mb-3 mt-5 ">
                        <label htmlFor="pname" className="form-label">Product Name</label>
                        <input type="text" className="form-control" id="pname" name="description" onChange={onChange1} value={product.description} />
                    </div>
                    <div className="mb-3 ">
                        <label htmlFor="price" className="form-label"> Price</label>
                        <input type="number" className="form-control col-2" id="price" name='price' onChange={onChange1} value={product.price} />
                    </div>

                    <div className="mb-3 ">
                        <label htmlFor="quantity" className="form-label"> Quantity</label>
                        <input type="number" className="form-control col-2" id="quantity" name="quantity" onChange={onChange1} value={product.quantity} />
                    </div>

                    <div className="row">
                        <div className="col-sm-4 mt-2">
                            <button className='btn btn-primary' onClick={handleAdd}> Add Product </button>
                        </div>
                        <div className="col-sm-4 mt-2">
                            <button className='btn btn-primary' onClick={handleClick}> Make Invoice </button>
                        </div>
                        <div className="col-sm-4 mt-2">
                            {
                                ok && <button className='btn btn-success' onClick={() => triggerBase64Download(base64, 'Invoice') //invoice is a name,base64 is pdf in form of string
                                }>
                                    Click to download
                                </button>
                            }
                            {flag && <img src={loading} alt="" width="50" height="50" />}
                        </div>
                    </div>

                    {ok && <h5 className='mt-5' style={{ "color": "green" }}>Your Invoice is Ready click to download</h5>}

                </div>
                <div className="col-sm-2"></div>
                <div className="col-md-4">
                    <div className="mt-5">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">No.of Product</th>
                                    <th scope="col">Product Name</th>
                                    <th scope="col">Price</th>
                                    <th scope="col">Quantity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    product_arr.map((p) => {
                                        return <tr key={count}>
                                            <th scope="row">{count++}</th>
                                            <td>{p.description}</td>
                                            <td>{p.price}</td>
                                            <td>{p.quantity}</td>
                                        </tr>
                                    })
                                }
                                <tr>

                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default Content


