const asyncHandler = require("express-async-handler");
const Contact = require("../../models/system/contactModel");

//@desc Get all contact
//@route GET /api/contacts
//@access private
const getContact = asyncHandler(async (req, res) => {
    const contacts = await Contact.find();
    res.status(200).json(contacts);
});

//@desc Get by id contact
//@route GET /api/contacts
//@access private
const getContactById = asyncHandler(async (req, res) => {
    const contacts = await Contact.find({_id: req.params.id});
    res.status(200).json(contacts);
});

//@desc create contact
//@route POST /api/contact
//@access private
const createContact = asyncHandler(async (req, res) => {
    const {name, email, phone} = req.body;
    if (!name || !email || !phone) {
        res.status(400);
        throw new Error("All fields are mandatory !");
    }
    const contacts = await Contact.create(
        {name: name,
        email: email,
        phone: phone,
        user_id: req.user.id
        }
    );
    res.status(201).json(contacts);
});

//@desc Update contact
//@route PUT /api/contact
//@access private
const updateContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById({_id: req.params.id});
    if (!contact) {
        res.status(404);
        throw new Error("Contact not found");
    }

    if (contact.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User don't have permission to update other user contacts");
    }


    const updateContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new: true}
    );
    res.status(200).json(updateContact);
});

//@desc Delete contact
//@route DELETE /api/contacts/:id
//@access private
const deleteContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById({_id: req.params.id});
    if (!contact) {
        res.status(404);
        throw new Error("Contact not found");
    }

    if (contact.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User don't have permission to update other user contacts");
    }
    const resDel = await Contact.deleteOne({_id: req.params.id});
    res.status(200).json({message: "success"});
});

module.exports = { getContact, createContact, updateContact, getContactById, deleteContact };