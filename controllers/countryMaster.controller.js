const { getAllStatedb,getAllCitydb } = require( "../repository/countryMaster.repository" );
const CustomError = require( "../utils/errorHandler.util.js" );

const getAllState = async ( req, res, next ) =>
{
    try
    { 
        const companyCode = req.auth.companyCode;

        const citystate = await getAllStatedb(companyCode);

        if ( !citystate )
        {
            res.status( 404 ).json( {
                success: false,
                message: "No City Found Please try again ",
                data: null
            } );
        } else
        {
            res.status( 200 ).json( {
                success: true,
                message: "All State found successfully",
                data: citystate
            } );
        }
    } catch ( error )
    {

        next( new CustomError( 500, "Failed to fetch contact data" ) );

    }
};
const getAllCity = async ( req, res, next ) =>
{
    try
    {
        const state =req.body.STATE;
        const companyCode = req.auth.companyCode;
        const cityState = await getAllCitydb(state, companyCode);

        console.log('cityState', cityState);

        if ( !cityState )
        {
            res.status( 404 ).json( {
                success: false,
                message: "No City Found Please try again ",
                data: null
            } );
        } else
        {
            res.status( 200 ).json( {
                success: true,
                message: "All City found successfully of "+state,
                data: cityState
            } );
        }
    } catch ( error )
    {

        next( new CustomError( 500, "Failed to fetch city by state" ) );

    }
};


module.exports = {
    getAllState,
    getAllCity
};
