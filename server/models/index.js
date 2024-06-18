const { sequelize, DataTypes } = require('../config/database');

const Users = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    role: {
        type: DataTypes.STRING,
        enum: ['User', 'PetWalker', 'PetGroomer', 'PetSitter', 'Vet', 'Specialist'],
        default: 'User',
    },
});

const Posts = sequelize.define('Post', {
    title: DataTypes.STRING,
    text: DataTypes.STRING,
    username: DataTypes.STRING
});

const PetSitterOffers = sequelize.define('PetSitterOffers', {
    title: DataTypes.STRING,
    text: DataTypes.STRING,
    username: DataTypes.STRING
});

const Comments = sequelize.define('Comment', {
    commentText: DataTypes.STRING,
    username: DataTypes.STRING,
});

const ProfileImage = sequelize.define('ProfileImage', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    base64Image: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
});

// Associations
Users.hasMany(Posts, { onDelete: "cascade" });
Users.hasMany(Comments, { onDelete: "cascade" });
Users.hasMany(PetSitterOffers, { onDelete: "cascade" });
Users.hasMany(ProfileImage, { onDelete: "cascade" });

PetSitterOffers.belongsTo(Users);
Posts.hasMany(Comments, { onDelete: "cascade" });
Comments.belongsTo(Users);
Comments.belongsTo(Posts);
ProfileImage.belongsTo(Users);

module.exports = { Users, Posts, Comments, PetSitterOffers, ProfileImage };
