import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

function SubirArchivoUser(usuario) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/uploads/upload-file",
        {
          file: data.file[0],
          userId: usuario.usuario._id,
          tipo: 'comprobante'
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      await axios.patch("http://localhost:8000/users/actualizar-fecha",{
          id:usuario.usuario._id,
          tipo: "comprobante"
      })
      setLoading(false);
      setSuccess(true);
      window.location.reload(true)
    } catch (error) {
      setLoading(false);
      setError(true);
      setErrorMessage(error.message);
    }
  };
  function handleFileInputChange(event) {
    const fileInput = event.target;
    const selectedFileName = fileInput.files[0]?.name || 'Seleccione archivo';
    fileInput.setAttribute("data-file-name", selectedFileName);
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="formSubirArchivo">
        <div className="input-group w-100 mx-auto">
          <input
            type="file"
            className="form-control"
            {...register("file", { required: true })}
            data-file-name="Select File.."
            onChange={handleFileInputChange}
          />
          <button type="submit" className={success ? "btn btn-success" : "btn btn-personalizado"}>
            {loading && (
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
            )}
            {!loading && !success && "Subir"}
            {success && (
              <>
                <span
                  className="me-2">
                  <i className="bi bi-check text-light"></i>
                </span>
              </>
            )}
          </button>
        </div>
        {errors.file && (
          <span className="text-danger fs-6">Seleccione un archivo.</span>
        )}
        {error && <p className="text-danger">{errorMessage}</p>}
      </form>
    </>
  );
}

export default SubirArchivoUser;