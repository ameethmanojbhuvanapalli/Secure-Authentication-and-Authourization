import React, { useEffect, useState } from "react";
import axios from "axios";

function Repository() {
  const [usermsg, setUsermsg] = useState("");
  const [userRole, setUserRole] = useState("ADMIN_ROLES");
  const [fname, setFname] = useState("");
  const [file, setFile] = useState();
  const [data, setData] = useState([]);
  const [editFilename, setEditFilename] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:9002/api/file/list")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        setUsermsg("Could not fetch files from Repository");
      });
  }, []);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  }

  const handleNameChange = (event) => {
    setFname(event.target.value);
  }

  const handleRoleChange = (event) => {
    setUserRole(event.target.value);
  }

  const handleEdit = (index) => {
    const fileToEdit = data[index];
    setEditFilename(fileToEdit.filename);
    setEditRole(fileToEdit.role);
    setEditIndex(index);
  }

  const handleEditSubmit = async () => {
    try {
      const updatedFile = {
        filename: editFilename,
        role: editRole
      };
      const response = await axios.post("http://localhost:9002/api/file/edit", updatedFile, {
        params: { filename: data[editIndex].filename },
        withCredentials: true
      });
      setUsermsg(response.data);
      // Update the file data in the state
      const newData = [...data];
      newData[editIndex] = { ...newData[editIndex], filename: editFilename, role: editRole };
      setData(newData);
      // Reset edit state
      setEditFilename("");
      setEditRole("");
      setEditIndex(null);
    } catch (error) {
      setUsermsg("Failed to edit file");
    }
  }

  const handleDelete = async (filename) => {
    try {
      const response = await axios.post("http://localhost:9002/api/file/delete", null, {
        params: { filename },
        withCredentials: true
      });
      setUsermsg(response.data);
      // Remove the deleted file from the state
      setData(data.filter((file) => file.filename !== filename));
    } catch (error) {
      setUsermsg("Failed to delete file from Repository");
    }
  }

  const handleDownload = async (filename) => {
    // Download logic
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('filename', fname);
      formData.append('role', userRole);
      const res = await axios.post("http://localhost:9002/api/file/upload", formData, { withCredentials: true });
      setUsermsg(res.data);
    } catch (err) {
      console.log(err)
      setUsermsg("Failed to add file to Repository");
    }
  }

  return (
    <div className="container mt-4">
      <div className="card text-center">
        <h1 className="card-header">Welcome to Digital Repository</h1>
        <div className="card-body">
          <p className="card-text">&nbsp;</p>
          <div className="alert alert-info" role="alert">
            {usermsg}
          </div>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">File Name</th>
                <th scope="col">Role</th>
                <th scope="col" colSpan="4">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((dataObj, index) => (
                <tr key={index}>
                  <td><a href={dataObj.filepath}>{dataObj.filename}</a></td>
                  <td>{dataObj.role}</td>
                  <td>
                    <button type="button" className="btn btn-primary" onClick={() => handleDownload(dataObj.filename)}>Download</button>
                  </td>
                  <td>
                    <button type="button" className="btn btn-warning" onClick={() => handleEdit(index)}>Edit</button>
                  </td>
                  <td>
                    <button type="button" className="btn btn-danger" onClick={() => handleDelete(dataObj.filename)}>Delete</button>
                  </td>
                </tr>
              ))}
              {editIndex !== null && (
                <tr>
                  <td>
                    <input type="text" value={editFilename} onChange={(e) => setEditFilename(e.target.value)} className="form-control" />
                  </td>
                  <td>
                    <select value={editRole} onChange={(e) => setEditRole(e.target.value)} className="form-control">
                      <option value="ADMIN_ROLES">Admin</option>
                      <option value="USER_ROLES">User</option>
                    </select>
                  </td>
                  <td colSpan="2">
                    <button type="button" className="btn btn-success" onClick={handleEditSubmit}>Save</button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="card-footer text-muted">
          <form onSubmit={handleSubmit} id="docform" encType="multipart/form-data">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col" colSpan="3">Add new file</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>File Name</td>
                  <td>:</td>
                  <td>
                    <input type="text" onChange={handleNameChange} className="form-control" />
                  </td>
                </tr>
                <tr>
                  <td>Select Role</td>
                  <td>:</td>
                  <td>
                    <select value={userRole} onChange={handleRoleChange} className="form-control">
                      <option value="ADMIN_ROLES">Admin</option>
                      <option value="USER_ROLES">User</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td>Select File</td>
                  <td>:</td>
                  <td>
                    <input type="file" onChange={handleFileChange} className="form-control" />
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td>
                    <button type="submit" className="btn btn-primary">Add File</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Repository;
