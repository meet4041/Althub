import React, { useState, useEffect, Fragment } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify';
import { ALTHUB_API_URL } from './baseURL';
import axios from 'axios';
import Loader from '../layout/Loader'
import Menu from '../layout/Menu';
import Footer from '../layout/Footer';

const AddCompany = () => {
    const navigate = useNavigate();
    useEffect(() => {
        document.getElementById('page-loader').style.display = 'none';
        var element = document.getElementById("page-container");
        element.classList.add("show");
    }, []);
    const [errors, setErrors] = useState({});
    const [disable, setDisable] = useState(false);

    const [data, setData] = useState({
        name: "",
        address:"",
        phone:"",
        email:"",
        website:"",
        image:""
    });
   
    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleReset = () => {
        setData({
            name: "",
            email:"",
            website:"",
            phone:"",
            address:"",
            image:""
        });
    }

    const handleSubmit = (e) => {
        if (validate()) {
            setDisable(true)
            var body = {
                name: data.name,
                address: data.address,
                phone: data.phone,
                email: data.email,
                website: data.website,
                image: data.image,
            };
            axios({
                method: "post",
                url: `${ALTHUB_API_URL}/api/addCompany`,
                data: body,
                
            }).then((response) => {
                console.log(response.data.data);
                handleReset();
                setDisable(false);
                toast.success("Company Added");
                setTimeout(() => {
                    navigate('/company');
                }, 1500);
            }).catch((error) => {
                console.log(error);
                setDisable(false);
            });
        } 
    };
    
  const handleImgChange = (e) => {
    var body = new FormData();
    body.append("image", e.target.files[0]);
    axios({
      method: "post",
      headers: { "Content-Type": "multipart/form-data" },
      url: `${ALTHUB_API_URL}/api/uploadCompanyImage`,
      data: body,
    })
      .then((response) => {
        console.log(response.data.data.url);
        setData({ ...data, image: response.data.data.url });
      })
      .catch((error) => {});
  };

    const validate = () => {
        let input = data;
        let errors = {};
        let isValid = true;

         if (!input["name"]) {
            isValid = false;
            errors["name_err"] = "Please Enter Company Name";
        }
        if (!input["email"]) {
            isValid = false;
            errors["email_err"] = "Please Enter Company Email";
        }
        if (!input["website"]) {
            isValid = false;
            errors["website_err"] = "Please Enter Company Website";
        }
        if (!input["phone"]) {
            isValid = false;
            errors["phone_err"] = "Please Enter Company Phone";
        }
        if (!input["address"]) {
            isValid = false;
            errors["address_err"] = "Please Enter Company Address";
        }
        setErrors(errors);
        return isValid;
    }

    return (
        <Fragment>
            <ToastContainer />
            <Loader />
            <div id="page-container" className="fade page-sidebar-fixed page-header-fixed">
                <Menu />
                <div id="content" className="content">
                    <ol className="breadcrumb float-xl-right">
                        <li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li>
                        <li className="breadcrumb-item"><Link to="/company">Companies</Link></li>
                        <li className="breadcrumb-item active">Add Company</li>
                    </ol>
                    <h1 className="page-header">Add Company  </h1>
                    <div className="row">
                        <div className="col-xl-6 ui-sortable">
                            <div className="panel panel-inverse" data-sortable-id="form-stuff-10">
                                <div className="panel-heading ui-sortable-handle">
                                    <h4 className="panel-title">Add Company</h4>
                                    <Link to="/company" className="btn btn-sm btn-default pull-right">Back</Link>
                                </div>
                                <div className="panel-body">
                                    <form>
                                        <fieldset>
                                            <div className="row">
                                                <div className="col-md-12 form-group">
                                                    <label htmlFor="exampleInputName">Name:</label>
                                                    <input type="text" className="form-control" id="exampleInputName" placeholder="Enter Name" name="name" onChange={handleChange} />
                                                    <div className="text-danger">{errors.name_err}</div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-12 form-group">
                                                    <label htmlFor="exampleInputEmail">Email:</label>
                                                    <input className="form-control" id="exampleInputEmail" placeholder="Enter Email Address" name="email" onChange={handleChange} />
                                                    <div className="text-danger">{errors.email_err}</div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-12 form-group">
                                                    <label htmlFor="exampleInputphone">Phone Number:</label>
                                                    <input type="number"className="form-control" id="exampleInputphone" placeholder="Enter Phone Number" name="phone"  onChange={handleChange} />
                                                    <div className="text-danger">{errors.phone_err}</div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-12 form-group">
                                                    <label htmlFor="exampleInputAddress">Address:</label>
                                                    <input className="form-control" id="exampleInputAddress" placeholder="Enter Address" name="address"  onChange={handleChange} />
                                                    <div className="text-danger">{errors.address_err}</div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-12 form-group">
                                                    <label htmlFor="exampleInputwebsite">Website:</label>
                                                    <input className="form-control" id="exampleInputwebsite" placeholder="Enter Website" name="website"  onChange={handleChange} />
                                                    <div className="text-danger">{errors.website_err}</div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-12 form-group">
                                                    <label >Image</label><br></br>
                                                    <input type='file' placeholder="Upload Photos" name="image"  onChange={handleImgChange}/>

                                                    {data.image ? (
                                                        <div>
                                                            <img
                                                                src={`${ALTHUB_API_URL}${data.image}`}
                                                                alt=""
                                                                height={150}
                                                                width={150}
                                                                style={{ objectFit: "cover", borderRadius: "50%" }}
                                                            />
                                                        </div>
                                                    ) : (
                                                        ""
                                                    )}
                                                </div>
                                            </div>
                                           
                                            <button type="button" className="btn btn-sm btn-success m-r-5" onClick={handleSubmit} >{disable ? 'Processing...' : 'Submit'}</button>
                                            <button type="reset" className="btn btn-sm btn-default" onClick={handleReset}>Reset</button>
                                        </fieldset>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </Fragment>
    )
}

export default AddCompany;