const express = require("express")
const {
    getNewBranchCodeDB,
    findAll,
    getBranch,
    shiftDetail,
    getHeadCH,
    findAllBranch,
    updateBranch,
    deleteBranch,
    createBranch,
} = require("../repository/branchMaster.repository")

const getNewBranchCode = async (req, res) => {
    try {
        const newBranchCode = await getNewBranchCodeDB();
        res.status(200).json({ success: true, message: "the new branch code created successfully ", data: newBranchCode })
    } catch (Error) {
        res.status(400).json({ Success: false, message: "Somthing went wrong " + Error.message })
    }
}

const findAllBranches = async (req, res, next) => {
    const companyCode = req.auth.companyCode;
    try {
        const branches = await findAll(companyCode);
        if (branches.length > 0) {
            res.status(200).json({
                success: true,
                message: "All branches retrieved successfully ",
                data: branches
            });
        } else {
            res.status(400).json({
                success: false,
                message: " There is no company with this company code please select a valid company !"
            });
        }
    } catch (error) {
        console.error("Error retrieving branches:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve branches",
            error: error.message
        });
    }
};

const getBranchDetail = async (req, res, next) => {
    try {
        const companyCode = req.auth.companyCode;
        const branchCode = req.body.branchCode;

        const result = await getBranch(branchCode, companyCode);

        if (result) {
            res.status(200).json({
                success: true,
                message: "Branch Detail Found successfully ",
                data: result
            })
        } else {
            res.status(400).json({
                success: false,
                message: "This Branch Is No Longer Avilable ! "
            })
        }

    } catch (Error) {

        console.error("Error In retrieving Branch:", Error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve Branch",
            error: Error.message
        });

    }
}

const getShiftDetails = async (req, res) => {
    try {
        const branchCode = req.params.branchCode;
        const companyCode = req.auth.companyCode;
        const shiftDetails = await shiftDetail(branchCode, companyCode);

        if (shiftDetails.length > 0) {
            res.status(200).json({
                success: true,
                message: "Shift details retrieved successfully",
                data: shiftDetails
            });
        } else {
            res.status(404).json({
                success: false,
                message: "No shift details found for this branch"
            });
        }
    } catch (error) {
        console.error("Error retrieving shift details:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve shift details",
            error: error.message
        });
    }
};

const getCommercialHead = async (req, res, next) => {
    try {
        const companyCode = req.auth.companyCode;
        const branchCode = req.body.branchCode;

        const result = await getHeadCH(branchCode, companyCode);

        if (result) {
            res.status(200).json({
                success: true,
                message: "Head CH found succesfully",
                data: result
            })
        } else {
            res.status(400).json({
                success: false,
                message: "Head CH not Found AT this branch tray later !"
            })
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to Get CH AND Head BY Branch ",
            error: error.message
        });
    }
};

const getAllBranches = async (req, res) => {
    try {
        const companyCode = req.auth.companyCode;
        const branches = await findAllBranch(companyCode);
        res.status(200).json({ success: true, data: branches });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateBranchController = async (req, res) => {
    const branchCode = req.params.code;
    const branchData = req.body;
    const companyCode = req.auth.companyCode;

    try {
        const updatedBranch = await updateBranch(branchCode, companyCode, branchData);

        res.status(200).json({
            success: true,
            message: "Branch updated successfully",
            data: updatedBranch,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update branch",
            error: error.message,
        });
    }
};

const addBranch = async (req, res) => {
    try {
        const newBranch = await createBranch(req.body);
        res.status(201).json({ success: true, data: newBranch });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const removeBranch = async (req, res) => {
    try {
        const code = req.params.code;
        await deleteBranch(code);
        res.status(200).json({ success: true, message: "Branch deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getNewBranchCode,
    findAllBranches,
    getBranchDetail,
    getShiftDetails,
    getCommercialHead,
    getAllBranches,
    updateBranchController,
    addBranch,
    removeBranch
}