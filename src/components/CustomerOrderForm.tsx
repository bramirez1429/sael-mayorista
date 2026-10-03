import { Form, Input, Radio } from "antd";

export type CustomerOrderData = {
  name: string;
  dni: string;
  locality: string;
  province: string;
  postalCode: string;
  email: string;
  phone: string;
  transport: string;
  deliveryType: "A domicilio" | "Sucursal";
};

export default function CustomerOrderForm() {
  return (
    <>
      <Form.Item name="name" label="Nombre y apellido" rules={[{ required: true, message: "Ingresa tu nombre y apellido" }]}>
        <Input />
      </Form.Item>
      <Form.Item name="dni" label="DNI" rules={[{ required: true, message: "Ingresa tu DNI" }]}>
        <Input />
      </Form.Item>
      <Form.Item name="locality" label="Localidad" rules={[{ required: true, message: "Ingresa tu localidad" }]}>
        <Input />
      </Form.Item>
      <Form.Item name="province" label="Provincia" rules={[{ required: true, message: "Ingresa tu provincia" }]}>
        <Input />
      </Form.Item>
      <Form.Item name="postalCode" label="Codigo postal" rules={[{ required: true, message: "Ingresa tu codigo postal" }]}>
        <Input />
      </Form.Item>
      <Form.Item name="email" label="Mail" rules={[{ required: true, message: "Ingresa tu mail" }, { type: "email", message: "Ingresa un mail valido" }]}>
        <Input type="email" />
      </Form.Item>
      <Form.Item name="phone" label="Telefono" rules={[{ required: true, message: "Ingresa tu telefono" }]}>
        <Input />
      </Form.Item>
      <Form.Item name="transport" label="Correo o transporte elegido" rules={[{ required: true, message: "Indica el correo o transporte elegido" }]}>
        <Input />
      </Form.Item>
      <Form.Item name="deliveryType" label="Tipo de entrega" rules={[{ required: true, message: "Selecciona el tipo de entrega" }]}>
        <Radio.Group>
          <Radio value="A domicilio">A domicilio</Radio>
          <Radio value="Sucursal">Sucursal</Radio>
        </Radio.Group>
      </Form.Item>
    </>
  );
}
