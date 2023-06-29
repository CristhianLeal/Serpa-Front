import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import './subirArchivo.css'

function SubirArchivo(usuario) {
  const [loading, setLoading] = useState(false);
  const [loadingr, setLoadingr] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successr, setSuccessr] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register: registerExpensa,
    handleSubmit: handleSubmitExpensa,
    formState: { errors: errorsExpensa },
  } = useForm();

  const {
    register: registerRecibo,
    handleSubmit: handleSubmitRecibo,
    formState: { errors: errorsRecibo },
  } = useForm();

  const onSubmitExpensa = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://serpaadministracionback.onrender.com/uploads/upload-file",
        {
          file: data.expensaFile[0],
          userId: usuario.usuario._id,
          tipo: 'expensa'
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      await axios.patch("https://serpaadministracionback.onrender.com/users/actualizar-fecha",{
          id:usuario.usuario._id,
          tipo: "expensa"
      });
      setLoading(false);
      setSuccess(true);
      window.location.reload(true);
    } catch (error) {
      setLoading(false);
      setError(true);
      setErrorMessage(error.message);
    }
  };

  const onSubmitRecibo = async (data) => {
    setLoadingr(true);
    try {
      const response = await axios.post(
        "https://serpaadministracionback.onrender.com/uploads/upload-file",
        {
          file: data.reciboFile[0],
          userId: usuario.usuario._id,
          tipo: 'recibo'
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      await axios.patch("https://serpaadministracionback.onrender.com/users/actualizar-fecha",{
          id:usuario.usuario._id,
          tipo: "recibo"
      });
      setLoadingr(false);
      setSuccessr(true);
      window.location.reload(true);
    } catch (error) {
      setLoadingr(false);
      setError(true);
      setErrorMessage(error.message);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmitExpensa(onSubmitExpensa)} className="formSubirArchivo">
        <div className="input-group w-100 mx-auto">
          <input
            type="file"
            className="form-control"
            {...registerExpensa("expensaFile", { required: true })}
          />
          <button type="submit" className={success ? "btn btn-success" : "btn btn-personalizado"}>
            {loading && (
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
            )}
            {!loading && !success && "Subir Expensa"}
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
        {errorsExpensa.expensaFile && (
          <span className="text-danger fs-6">Seleccione un archivo.</span>
        )}
        {error && <p className="text-danger">{errorMessage}</p>}
      </form>

      <form onSubmit={handleSubmitRecibo(onSubmitRecibo)} className="formSubirArchivo">
        <div className="input-group w-100 mx-auto">
          <input
            type="file"
            className="form-control"
            {...registerRecibo("reciboFile", { required: true })}
          />
          <button type="submit" className={successr ? "btn btn-success" : "btn btn-personalizado"}>
            {loadingr && (
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
            )}
            {!loadingr && !successr && "Subir Recibo"}
            {successr && (
              <>
                <span
                  className="me-2">
                  <i className="bi bi-check text-light"></i>
                </span>
              </>
            )}
          </button>
        </div>
        {errorsRecibo.reciboFile && (
          <span className="text-danger fs-6">Seleccione un archivo.</span>
        )}
        {error && <p className="text-danger">{errorMessage}</p>}
      </form>
    </>
  );
}

export default SubirArchivo;