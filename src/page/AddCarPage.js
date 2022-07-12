import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    FormGroup,
    ModalFooter,
    Label,
    Input,
    Col,
  } from "reactstrap";
  import { useState, useEffect } from "react";
  import axios from "axios";
  
  function AddNewCar({ onAdded}) {
    const [modal, setModal] = useState(false);
    const [car, setCar] = useState({
      mf_id: "",
      model: "",
      description: "",
      produced_on: "",
      image: "",
      file: null,
    });
  
    const handlerInput = (e) => {
      const { name, value } = e.target;
      console.log(car);
      setCar({
        ...car,
        [name]: value,
      });
    };
  
    const handlerImageFile = (e) => {
      setCar({
        ...car,
        file: URL.createObjectURL(e.target.files[0]),
        image: e.target.files[0].name,
      });
    };

    
    const onChangeModel=(event)=>{
        setCar(previousState=>{
            return {...previousState,model: event.target.value};
        });
        console.log(car);
    };

    const onChangeDesc=(event)=>{
        setCar(previousState=>{
            return {...previousState,description: event.target.value};
        });
        console.log(car);
    };
    const onChangeProduced=(event)=>{
        setCar(previousState=>{
            return {...previousState,produced_on: event.target.value};
        });
        console.log(car);
    };
  
    const toggle = () => {
      setModal(!modal);
    };
  
    const onRedirect = () => {
      setCar({});
      toggle();
      onAdded(false);
    };
    const handleSubmitForm = (e) => {
      e.preventDefault();
      const fileInput = document.querySelector("#fileinput");
  
      console.log(fileInput.files[0]);
      const formData = new FormData();
      formData.append("image", fileInput.files[0]);
      formData.append("description", car.description);
      formData.append("model", car.model);
      formData.append("mf_id", car.mf_id);
      formData.append("produced_on", car.produced_on);
  
      axios
        .post("http://127.0.0.1:8000/api/cars", formData)
        .then(function (response) {
          console.log(response);
          onRedirect();
        })
        .catch(function (error) {
          console.log(error);
        });
    };
    
    const handlerMf = (e) => {
      const { name, value } = e.target;
      console.log(car);
      setCar({
        ...car,
        [name]: value,
      });
    };
  
    const [mfs, setMfs] = useState({
      mfsList: [],
      isLoaded: false,
    });
    const getMfs = async () => {
      var res = await axios("http://127.0.0.1:8000/api/mf");
      var mfsList = await res.data;
      console.log(mfsList);
      setMfs({ mfsList, isLoaded: true });
    };
    useEffect(() => {
      if (!mfs.isLoaded) getMfs();
    }, []);
  
    
    return (
      mfs.isLoaded? 
      <>
          <form
            onSubmit={handleSubmitForm}
            encType="multipart/form-data"
            method="post"
          >
              <FormGroup>
                <Label>Model</Label>
                <Input
                  id="model"
                  value={car ? car.model : ""}
                  onChange={onChangeModel}
                  name="model"
                  type="text"
                />
              </FormGroup>
              <FormGroup>
                <Label>Description</Label>
                <Input
                  id="description"
                  value={car ? car.description : ""}
                  onChange={onChangeDesc}
                  name="description"
                  type="text"
                />
              </FormGroup>
              <FormGroup>
                <Label for="mf_id">Manufacturer</Label>
                <select name="mf_id" onChange={handlerMf}>
                  {mfs.mfsList.map((mf, index) => {
                    return (
                      <option value={mf.id} key={index}>
                        {mf.mf_name}
                      </option>
                    );
                  })}
                </select>
              </FormGroup>
              <FormGroup>
                <Label>Produced_on</Label>
                <Input
                  id="produced_on"
                  value={car ? car.produced_on : ""}
                  onChange={onChangeProduced}
                  name="produced_on"
                  type="date"
                />
              </FormGroup>
              <FormGroup row>
                <Label sm={2}>Image</Label>
                <Col sm={5}>
                  <Input
                    id="fileinput"
                    onChange={handlerImageFile}
                    name="fileinput"
                    type="file"
                  />
                </Col>
                <Col sm={5}>
                  <img
                    className="img-thumnail"
                    style={{ width: "10rem" }}
                    src={car ? car.file : null}
                    alt=""
                  />
                </Col>
              </FormGroup>
          </form>
      </>
      : <div>Loading...</div>
    );
  }
  export default AddNewCar;
  