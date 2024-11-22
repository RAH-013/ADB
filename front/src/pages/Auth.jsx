import { Form, Formik } from "formik";
import { auth } from "../api/servidor";

function Auth() {
  return (
    <div>
      <Formik
        initialValues={{
          host: "localhost",
          port: 3306,
          user: "root",
          password: "",
        }}
        onSubmit={async (values) => {
          try {
            const response = await auth(values);
            console.log(response);
          } catch (error) {
            console.log(error);
          }
        }}
      >
        {({ handleChange, handleSubmit, values, isSubmitting }) => (
          <Form onSubmit={handleSubmit}>
            <label>Host</label>
            <input type="text" name="host" value={values.host} onChange={handleChange} />
            <label>Puerto</label>
            <input type="number" name="port" value={values.port} onChange={handleChange} />
            <label>Usuario</label>
            <input type="text" name="user" value={values.user} onChange={handleChange} />
            <label>Contraseña</label>
            <input type="password" name="password" onChange={handleChange} />
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Conectando..." : "Conectar"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default Auth;
