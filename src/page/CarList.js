import { useState, useEffect } from "react";
import axios from "axios";
import { Button, Input } from "reactstrap";
import EditCar from "./EditCar";
import AddNewCar from "./AddNewCar";

function CarList() {
  const [search, setSearch] = useState("");
  const handleSearch = async (e) => {
    const res = await axios.get(
      `http://localhost:8000/api/show?search=${search}`
    );
    setCars({ CarList: res, isLoaded: true });
  };
  const [cars, setCars] = useState([
    {
      id: "",
      model: "",
      description: "",
      produced_on: "",
      image: "",
    },
  ]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [noDataFound, setNoDataFound] = useState("");

  useEffect(() => {
    if (!isLoaded) getCars();
  }, [isLoaded]);

  const getCars = () => {
    axios
      .get("http://127.0.0.1:8000/api/cars")
      .then(function (res) {
        if (res.status === 200) {
          setCars(res.data.data ? res.data.data : []);
          console.log(res.data.data ? res.data.data : []);
          console.log(cars);
        }
        if (res.data.status === "failed" && res.data.success === false) {
          setNoDataFound(res.data.data);
          console.log(noDataFound);
        }
        console.log(res.data.data);
        setCars(res.data.data);
        setIsLoaded(true);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const [editmodal, setEditModal] = useState(false);
  const [editCarData, setEditCarData] = useState({
    id: "",
    model: "",
    description: "",
    mf_id: "",
    produced_on: "",
    image: "",
  });

  const toggleEditModal = (car) => {
    setEditModal(!editmodal);
    if (editmodal === false) setEditCarData(car);
    console.log(editCarData);
  };
  const deleteCar = (id) => {
    axios
      .delete("http://localhost:8000/api/cars/" + id)
      .then((res) => {
        console.log("Car removed deleted");
        getCars();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handlerOnchange = (e) => {
    const val = e.target.value;
    setSearch(val);
    console.log(search);
  };
  return (
    <div className="container fluid">
      <Input
        search="text"
        className="form-control"
        value={search}
        placeholder="Enter model"
        onChange={handlerOnchange}
        style={{ width: "50em" }}
      /> 
      <br></br>
      <h2>Danh s??ch xe</h2>
      <AddNewCar onAdded={setIsLoaded} getCars={getCars} />
      <EditCar
        cars={cars}
        setCars={setCars}
        getCars={getCars}
        toggleEditModal={toggleEditModal}
        editmodal={editmodal}
        editCarData={editCarData}
        setEditCarData={setEditCarData}
      />

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Model</th>
            <th>Description</th>
            <th>Manufacturer</th>
            <th>Products_on</th>
            <th>Image</th>
            <th colSpan={2}>Function</th>
          </tr>
        </thead>
        <tbody>
          {!!cars ? (
            cars
              .filter((cars) =>
                search === ""
                  ? true
                  : cars.model.toLowerCase().indexOf(search.toLowerCase()) !==
                    -1
              )
              .map((car, index) => (
                <tr key={index}>
                  <th scope={"row"}>{car.id}</th>
                  <td>{car.model}</td>
                  <td style={{ width: "35em" }}>{car.description}</td>
                  <td>{car.name_mfs}</td>
                  <td>{car.produced_on}</td>
                  <td>
                    <img
                      src={`http://localhost:8000/images/${car.image}`}
                      style={{ width: "100px" }}
                      alt=""
                    />
                  </td>
                  <td colSpan={2}>
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={() => toggleEditModal(car)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => {
                        if (window.confirm("B???n c?? ch???c ch???n x??a?"))
                          deleteCar(car.id);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
          ) : (
            <tr>
              <td>No Data in API</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default CarList;
