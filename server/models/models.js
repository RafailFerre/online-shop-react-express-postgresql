import sequelize from "../config/db.js";  // const sequelize = require('../db');
import { DataTypes } from "sequelize";  // const { DataTypes } = require('sequelize');

export const User = sequelize.define("user", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, unique: true },
    password: { type: DataTypes.STRING },
    role: { type: DataTypes.STRING, defaultValue: "USER" },
});

export const Basket = sequelize.define("basket", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

export const BasketDevice = sequelize.define("basket_device", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    quantity: { type: DataTypes.INTEGER, defaultValue: 1, allowNull: false }, // Add quantity field
});

export const Device = sequelize.define("device", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
    price: { type: DataTypes.INTEGER, allowNull: false },
    rating: { type: DataTypes.INTEGER, defaultValue: 0 },
    img: { type: DataTypes.STRING, allowNull: false },
});

export const Type = sequelize.define("type", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
});

export const Brand = sequelize.define("brand", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
});

export const Rating = sequelize.define("rating", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    rate: { type: DataTypes.INTEGER, allowNull: false },
});

export const DeviceInfo = sequelize.define("device_info", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false },
});

export const TypeBrand = sequelize.define("type_brand", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

// Order model
export const Order = sequelize.define("order", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    total: { type: DataTypes.INTEGER, allowNull: false }, // Total order amount
    address: { type: DataTypes.STRING, allowNull: false }, // Delivery address
    status: { type: DataTypes.STRING, defaultValue: "pending", allowNull: false }, // Order status
});

// OrderDevice model (junction table for orders and devices)
export const OrderDevice = sequelize.define("order_device", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    quantity: { type: DataTypes.INTEGER, defaultValue: 1, allowNull: false },
});

// Define relationships between models
User.hasOne(Basket);
Basket.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Rating);
Rating.belongsTo(User);


Device.hasMany(BasketDevice);
BasketDevice.belongsTo(Device);

Basket.hasMany(BasketDevice);
BasketDevice.belongsTo(Basket);


Order.hasMany(OrderDevice);
OrderDevice.belongsTo(Order);

Device.hasMany(OrderDevice);
OrderDevice.belongsTo(Device);


Type.hasMany(Device);
Device.belongsTo(Type);


Brand.hasMany(Device);
Device.belongsTo(Brand);


Device.hasMany(Rating);
Rating.belongsTo(Device);

Device.hasMany(DeviceInfo);
DeviceInfo.belongsTo(Device);


Type.belongsToMany(Brand, { through: TypeBrand });
Brand.belongsToMany(Type, { through: TypeBrand });

// Each model represents a table in the database and defines its structure and relationships with other tables.