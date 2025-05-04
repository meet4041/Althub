import React, { useState, useEffect, Fragment } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify';
import { ALTHUB_API_URL } from './baseURL';
import axios from 'axios';
import Loader from '../layout/Loader'
import Menu from '../layout/Menu';
import Footer from '../layout/Footer';

const AddPost = () => {
    const institute_Id = localStorage.getItem("AlmaPlus_institute_Id");
    const [iname, setiname] = useState('');
    const [image,setImage]=useState("");
    const navigate = useNavigate();

    useEffect(() => {
        document.getElementById('page-loader').style.display = 'none';
        var element = document.getElementById("page-container");
        element.classList.add("show");

    }, []);
    const [errors, setErrors] = useState({});
    const [disable, setDisable] = useState(false);

    const [data, setData] = useState({
        description: "",
    });
    const [fileList, setFileList] = useState(null);
    const files = fileList ? [...fileList] : [];

    const imgChange = (e) => {
        setFileList(e.target.files);
    }

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleReset = () => {
        setData({
            description: "",
        });
    }
    const getData = () => {
        const myurl = `${ALTHUB_API_URL}/api/getInstituteById/${institute_Id}`;
        axios({
            method: "get",
            url: myurl,
        }).then((response) => {
            if (response.data.success === true) {
                setiname(response.data.data.name);
            }
        });
    };

    const getInstitute = () =>{
        axios({
            url:`${ALTHUB_API_URL}/api/getInstituteById/${institute_Id}`,
            method:"get",
        }).then((Response)=>{
            setImage(Response.data.data.image&&Response.data.data.image);
        })
    }

    useEffect(() => {
        getData();
        getInstitute();
    }, [institute_Id]);

    const submitHandler = (e) => {
        e.preventDefault();
        if (validate()) {
            setDisable(true)
            const body = new FormData();
            body.append("userid", institute_Id);
            body.append("fname", iname);
            body.append("description", data.description);
            files.forEach((file, i) => {
                body.append(`photos`, file, file.name);
            });
            body.append("profilepic", image);
            body.append("date", new Date());
            axios({
                method: "post",
                url: `${ALTHUB_API_URL}/api/instituteAddPost`,
                data: body,
                headers: {
                    "content-type": "multipart/form-data"
                },
            }).then((response) => {
                console.log(response.data.data);
                handleReset();
                setDisable(false);
                toast.success("Post Added");
                setTimeout(() => {
                    navigate('/posts');
                }, 1500);
            }).catch((error) => {
                console.log(error);
                setDisable(false);
            });
        }
    };

    const validate = () => {
        let input = data;
        let errors = {};
        let isValid = true;

        if (!input["description"]) {
            isValid = false;
            errors["description_err"] = "Please Enter Description";
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
                        <li className="breadcrumb-item"><Link to="/posts">Posts</Link></li>
                        <li className="breadcrumb-item active">Add Post</li>
                    </ol>
                    <h1 className="page-header">Add Post  </h1>

                    <div className="row">
                        <div className="col-xl-6 ui-sortable">
                            <div className="panel panel-inverse" data-sortable-id="form-stuff-10">
                                <div className="panel-heading ui-sortable-handle">
                                    <h4 className="panel-title">Add Post</h4>
                                    <Link to="/posts" className="btn btn-sm btn-default pull-right">Back</Link>
                                </div>


                                <div className="panel-body">
                                    <form onSubmit={submitHandler}>
                                        <fieldset>
                                            <div className="row">
                                                <div className="col-md-12 form-group">
                                                    <label htmlFor="exampleInputdesc">Description:</label>
                                                    <input className="form-control" id="exampleInputdesc" placeholder="Enter Description" name="description" value={data.description} onChange={handleChange} />
                                                    <div className="text-danger">{errors.description_err}</div>
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="col-md-12 form-group">
                                                    <label htmlFor="exampleInputfile">Upload Photos:</label>
                                                    <input type='file' multiple="true" className="form-control" id="exampleInputfile" placeholder="Upload Photos" name="photos" value={data.photos} onChange={imgChange} />
                                                    {files.length > 0 ?
                                                        <div className="selected-img row mt-2">
                                                            {files.map((elem) =>
                                                                <div className='col col-2 ml-2'>
                                                                    <img src={window.URL.createObjectURL(elem)} alt="" height={100} width={100} />
                                                                </div>
                                                            )}
                                                        </div>
                                                        : ""}
                                                </div>
                                            </div>
                                            <button className="btn btn-sm btn-success m-r-5">{disable ? 'Processing...' : 'Submit'}</button>
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

export default AddPost;