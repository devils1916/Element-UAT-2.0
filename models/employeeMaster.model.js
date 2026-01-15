const { de } = require("date-fns/locale");

module.exports = (sequelize, DataTypes) => {
    return sequelize.define("Employee", {
        EmpId1: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
        },
        EmpID: {
            type: DataTypes.STRING(50),
            primaryKey: true,
            allowNull: false,
            unique: true
        },
        Name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        Department: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        Designation: {
            type: DataTypes.STRING(100),
            allowNull: false,
            defaultValue: ' '
        },
        Grade: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: ' '
        },
        CompanyCode: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: ' '
        },
        BranchCode: {
            type: DataTypes.STRING(25),
            allowNull: false,
            defaultValue: ''
        },
        WorkLocation: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: ' '
        },
        Position: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: ' '
        },
        HierarchyCode: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: ' '
        },
        Address: {
            type: DataTypes.STRING(500),
            allowNull: false,
            defaultValue: ' '
        },
        City: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0  
        },
        PhoneNo: {
            type: DataTypes.BIGINT,
            allowNull: false,
            defaultValue: 0
        },
        PinCode: {
            type: DataTypes.STRING(10),
            allowNull: false,
            defaultValue: ' '
        },
        Email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            defaultValue: ' '
        },
        Fax: {
            type: DataTypes.STRING(100),
            allowNull: false,
            defaultValue: ' '
        },
        OwnConv: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        DistFromHouse: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        PFNo: {
            type: DataTypes.STRING(25),
            allowNull: false,
            defaultValue: ' '
        },
        ESICNo: {
            type: DataTypes.STRING(25),
            allowNull: false,
            defaultValue: ' '
        },
        PanNo: {
            type: DataTypes.STRING(25),
            allowNull: false,
            defaultValue: ' '
        },
        Married: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        DoB: {
            type: DataTypes.DATEONLY,
            allowNull: false,   
            defaultValue: new Date('1900-01-01')
        },
        JoiningDt: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            defaultValue: new Date('1900-01-01')
        },
        EduQualification: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: ' '
        },
        ProfQualification: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: ' '
        },
        OwnHouse: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        GrossSalary: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        InActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,    
        },
        InActiveDate: {
            type: DataTypes.STRING(100),
            defaultValue: ' '
        },
        Sex: {
            type: DataTypes.STRING(25),
            allowNull: false,
            defaultValue: ' '
        },
        CardNo: {
            type: DataTypes.STRING(25),
            allowNull: false,
            defaultValue: ' '
        },
        Comm: {
            type: DataTypes.DECIMAL(18, 3),
            allowNull: false,
            defaultValue: 0.000
        },
        PresentAddress: {
            type: DataTypes.STRING(300),
            allowNull: false,
            defaultValue: ' '
        },
        FatherName: {
            type: DataTypes.STRING(150),
            allowNull: false,
            defaultValue: ' '
        },
        MotherName: {
            type: DataTypes.STRING(150),
            allowNull: false,
            defaultValue: ' '
        },
        ShiftCode: {
            type: DataTypes.STRING(25),
            allowNull: false,
            defaultValue: ' '
        },
        isOverTimeAllowed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        hasLeft: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        LeftDate: {
            type: DataTypes.STRING(100),
            defaultValue: ' '
        },
        isAdvAcc: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        isTourAcc: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        RegdNo: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: ' '
        },
        LevelCode: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: ' '
        },
        Band: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: ' '
        },
        oldCode: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: ' '
        },
        Sepration: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: ' '
        },
        State: {
            type: DataTypes.STRING(100),
            allowNull: false,
            defaultValue: ' '
        },
        Country: {
            type: DataTypes.STRING(100),
            allowNull: false,
            defaultValue: ' '
        },
        AdvAcc: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: ' '
        },
        TourAcc: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: ' '
        },
        TxtApplCode: {
            type: DataTypes.STRING(25),
            allowNull: false,
            defaultValue: ' '
        },
        MobileNo: {
            type: DataTypes.STRING(25),
            allowNull: false,
            defaultValue: ' '
        },
        IsESICApplicable: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        PFCalculationType: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        EmpType: {
            type: DataTypes.STRING(25),
            allowNull: false,
            defaultValue: ' '
        },
        UnitESIC: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: ' '
        },
        UnitESICNo: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: ' '
        },
        BankName: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: ' '
        },
        AccountNo: {
            type: DataTypes.STRING(50),
            allowNull: false,   
            defaultValue: ' '
        },
        CustCode: {
            type: DataTypes.STRING(50),
            defaultValue: ' '
        },
        CustName: {
            type: DataTypes.STRING(150),
            defaultValue: ' '
        },
        IsBilled: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        IsLWFApplicable: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        RMEmpId: {
            type: DataTypes.STRING(25),
            defaultValue: ' '
        },
        RMEmpName: {
            type: DataTypes.STRING(100),
            defaultValue: ' '
        },
        RMEmailId: {
            type: DataTypes.STRING(100),
            defaultValue: ' '
        },
        IsRM: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        IsBranchHead: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        ProductName: {
            type: DataTypes.STRING(100),
            defaultValue: ' '
        },
        Branchheadid: {
            type: DataTypes.STRING(25),
            defaultValue: ' '
        },
        BranchHeadName: {
            type: DataTypes.STRING(100),
            defaultValue: ''
        },
        BranchheademailId: {
            type: DataTypes.STRING(100),
            defaultValue: ' '
        },
        Draftjoiningdt: {
            type: DataTypes.STRING(100),
            defaultValue: ' '
        },
        HeadId: {
            type: DataTypes.STRING(25),
            defaultValue: ' '
        },
        HeadName: {
            type: DataTypes.STRING(100),
            defaultValue: ' '
        },
        HeadEmailId: {
            type: DataTypes.STRING(100),
            defaultValue: ''
        },
        IsHead: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        UANNo: {
            type: DataTypes.STRING(50),
            defaultValue: ' '
        },
        HasRegin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        ResignationDate: {
            type: DataTypes.DATEONLY,
            defaultValue: new Date('1900-01-01')
        },
        AdharNo: {
            type: DataTypes.STRING(50),
            defaultValue: ' '
        },
        AccountId: {
            type: DataTypes.STRING(50),
            defaultValue: ' '
        },
        AccountName: {
            type: DataTypes.STRING(100),
            defaultValue: ' '
        },
        AccountEmailId: {
            type: DataTypes.STRING(100),
            defaultValue: ' '
        },
        IsAccount: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        PTaxapplicable: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        NameInBank: {
            type: DataTypes.STRING(200),
            defaultValue: ' '
        },
        BloodGroup: {
            type: DataTypes.STRING(50),
            defaultValue: ' '
        },
        EduQualificationYear: {
            type: DataTypes.STRING(50),
            defaultValue: ' '
        },
        ProfQualificationYear: {
            type: DataTypes.STRING(50),
            defaultValue: ' '
        },
        FirstCompanyName: {
            type: DataTypes.STRING(200),
            defaultValue: ' '
        },
        FirstCompanyFromDate: {
            type: DataTypes.DATEONLY,
            defaultValue: '1900-01-01'
        },
        FirstCompanyTodate: {
            type: DataTypes.DATEONLY,
            defaultValue: '1900-01-01'
        },
        FirstCompanyDesignation: {
            type: DataTypes.STRING(100),
            defaultValue: ' '
        },
        SecondCompanyName: {
            type: DataTypes.STRING(200),
            defaultValue: ' '
        },
        SecondCompanyFromDate: {
            type: DataTypes.DATEONLY,
            defaultValue: '1900-01-01'
        },
        SecondCompanyTodate: {
            type: DataTypes.DATEONLY,
            defaultValue: '1900-01-01'
        },
        SecondCompanyDesignation: {
            type: DataTypes.STRING(100),
            defaultValue: ' '
        },
        FatherDOB: {
            type: DataTypes.DATEONLY,
            defaultValue: new Date('1900-01-01')
        },
        FatherAadharno: {
            type: DataTypes.STRING(50),
            defaultValue: ' '
        },
        MotherDOB: {
            type: DataTypes.DATEONLY,
            defaultValue: new Date('1900-01-01')
        },
        MotherAadharno: {
            type: DataTypes.STRING(50),
            defaultValue: ' '
        },
        StoreName: {
            type: DataTypes.STRING(200),
            defaultValue: ' '
        },
        Channel: {
            type: DataTypes.STRING(50),
            defaultValue: ' '
        },
        ProductHeadName: {
            type: DataTypes.STRING(100),
            defaultValue: ' '
        },
        NationalProductHead: {
            type: DataTypes.STRING(200),
            defaultValue: ' '
        },
        MaritalStatus: {
            type: DataTypes.STRING(50),
            defaultValue: ' '
        },
        SpouseName: {
            type: DataTypes.STRING(200),
            defaultValue: ' '
        },
        SpouseDOb: {
            type: DataTypes.DATEONLY,
            defaultValue: new Date('1900-01-01')
        },
        SpouseAadharno: {
            type: DataTypes.STRING(50),
            defaultValue: ' '
        },
        Child1Name: {
            type: DataTypes.STRING(200),
            defaultValue: ' '
        },
        Child1DOB: {
            type: DataTypes.DATEONLY,
            defaultValue: new Date('1900-01-01')
        },
        Child1Gender: {
            type: DataTypes.STRING(50),
            defaultValue: ' '   
        },
        Child1Aadharno: {
            type: DataTypes.STRING(50),
            defaultValue: ' '
        },
        Chile2Name: {
            type: DataTypes.STRING(200),
            defaultValue: ' '
        },
        Child2DOB: {
            type: DataTypes.DATEONLY,
            defaultValue: new Date('1900-01-01')
        },
        Child2Aadharno: {
            type: DataTypes.STRING(50),
            defaultValue: ' '
        },
        Child2Gender: {
            type: DataTypes.STRING(50),
            defaultValue: ' '
        },
        NomeneeName: {
            type: DataTypes.STRING(200),
            defaultValue: ' '
        },
        ReleationwithNomnee: {
            type: DataTypes.STRING(50),
            defaultValue: ' '
        },
        NEsic: {
            type: DataTypes.STRING(200),
            defaultValue: ' '
        },
        Child3Name: {
            type: DataTypes.STRING(200),
            defaultValue: ' '
        },
        Child3DOB: {
            type: DataTypes.DATEONLY,
            defaultValue: new Date('1900-01-01')
        },
        Child3Gender: {
            type: DataTypes.STRING(50),
            defaultValue: ' '
        },
        Child3Aadharno: {
            type: DataTypes.STRING(50),
            defaultValue: ' '
        },
        Child4Name: {
            type: DataTypes.STRING(200),
            defaultValue: ' '
        },
        Child4DOB: {
            type: DataTypes.DATEONLY,
            defaultValue: new Date('1900-01-01')
        },
        Child4Gender: {
            type: DataTypes.STRING(50),
            defaultValue: ' '
        },
        Child4Aadharno: {
            type: DataTypes.STRING(50),
            defaultValue: ' '
        },
        Division: {
            type: DataTypes.STRING(50),
            defaultValue: ' '
        },
        Joined: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        Org_Unit_Code: {
            type: DataTypes.STRING(50),
            defaultValue: ' '
        },
        Profile_Code: {
            type: DataTypes.STRING(50),
            defaultValue: ' '
        },
        Div_Code: {
            type: DataTypes.STRING(1000),
            defaultValue: ' '
        },
        Dept_Code: {
            type: DataTypes.STRING(50),
            defaultValue: ' '
        },
        Sale_Office_Code: {
            type: DataTypes.STRING(50),
            defaultValue: ' '
        },
        Designation_Code: {
            type: DataTypes.STRING(50),
            defaultValue: ' '
        },
        ReportingTo: {
            type: DataTypes.STRING(50),
            defaultValue: ' '
        },
        UserType: {
            type: DataTypes.STRING(50),
            defaultValue: ' '
        },
        T_EndDate: {
            type: DataTypes.DATEONLY,
            defaultValue: new Date('1900-01-01')
        },
        CTC: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        WeekOff: {
            type: DataTypes.STRING(50),
            defaultValue: ' '
        },
        TL_Emp_Code: {
            type: DataTypes.STRING(50),
            defaultValue: ' '
        },
        TL_Emp_Name: {
            type: DataTypes.STRING(100),
            defaultValue: ' '
        },
        TL_Email: {
            type: DataTypes.STRING(100),
            defaultValue: ' '
        },
        isTL: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        FaxOtp: {
            type: DataTypes.STRING(50),
            defaultValue: ' '
        },
        Abscond: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        Office_Email: {
            type: DataTypes.STRING(100),
            defaultValue: ' '
        },
        Store_Code: {
            type: DataTypes.STRING(50),
            defaultValue: ' '
        },
        StoreLocation: {
            type: DataTypes.STRING(1000),
            defaultValue: ' '
        },
        SalesOffice: {
            type: DataTypes.STRING(50),
            defaultValue: ' '
        },
        Region: {
            type: DataTypes.STRING(50),
            defaultValue: ' '
        },
        ActualChannel: {
            type: DataTypes.STRING(200),
            defaultValue: ' '
        },
        ActualDOJ: {
            type: DataTypes.STRING(100),
            defaultValue: ' '
        },
        LocationCode: {
            type: DataTypes.STRING(100),
            defaultValue: ' '
        },
        BUHR: {
            type: DataTypes.STRING(100),
            defaultValue: ' '
        },
        LocationHR: {
            type: DataTypes.STRING(100),
            defaultValue: ''
        },
        PositionCode: {
            type: DataTypes.STRING(100),
            defaultValue: ' '
        },

        ContactPeriod : {
            type : DataTypes.STRING(100),
            defaultValue: ' '
        },
        CompOHRID  : {
            type : DataTypes.STRING(100),
            defaultValue: ' '
        },
        RMOHRID : {
            type : DataTypes.STRING(100),
            defaultValue: ' '
        },
        EmployeeOHRID : {
            type : DataTypes.STRING(100),
            defaultValue: ' '
        },
        NSEZCategory : {
            type : DataTypes.STRING(100),
            defaultValue: ''
        },
        LocationAddress : {
            type : DataTypes.STRING(100),
            defaultValue: ' '
        },
        Category   : {
            type : DataTypes.STRING(100),
            defaultValue: ' '
        },
        lapadId : {
            type : DataTypes.STRING(100),
            defaultValue: ' '
        },
        officialEmailId   : {
            type : DataTypes.STRING(100),
            defaultValue: ' '
        },
        newCompanyCode   : {
            type : DataTypes.STRING(100),
            defaultValue: ' '
        }
    }, {
        tableName: "EmployeeMaster",
        timestamps: false,
        freezeTableName: true,
    });
}