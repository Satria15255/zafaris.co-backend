const Voucher = require("../models/Voucher")

// create Voucher
exports.createVoucher = async(req,res) => {
	try{
		const {
			code, description, discount,minPurchase,maxDiscount,usage, usagePerUser,validity, scope
		}=  req.body

		if (!code || !discount?type || discount?.value === undefined || !validity?.startDate || !validity?.endDate ){
			return res.status(400).json({message : "Required Voucher fields are missing"})
		}

		// Validate percentage
		if(discount.value <= 0 || discount.value > 100){
			return res.status(400).json({message: "Percentage discount must be between 1 and 100"})
		}

		// Validate fixed discount
		if(discount.type === "fixed" && discount.value <=  0){
			return res.status(400).json({message: "Fixed discount must greater than 0"})
		}

		// Validate Voucher Date
		const startDate = new Date(validity.startDate)
		const endDate = new Date(validity.endDate)

		if(isNaN(startDate) || isNaN(endDate)){
			return res.status(400).json({message: "Invalid Voucher Date"})
		}

		if(endDate <= startDate){
			return res.status(400).json({message:  "End date must be after start date"})
		}

		const existingVoucher  = await Voucher.findOne({
			code : code.toUpperCase().trim()
		})

		if(existingVoucher){
			return res.status(409).json({message: "Voucher already exist"})
		}

		const voucher = await Voucher.create({
			code,
			description,
			discount,
			minPurchase,
			maxDiscount,
			usage,
			usagePerUser,
			validity,
			scope,
		})

		return res.status(201).json({message:  "Voucher created successfully", voucher})
	}catch(error){
		console.error("Create voucher error",error)
		return res.status(500).json({
			message:"Failed to create voucher",
			error: error.message
		})
	}
}

exports.getAllVoucher = async(req,res) => {
	try{
		const vouchers = await Voucher.find()
		.populate("scope.products", "name")
		.sort({createdAt: -1})

		return res.status(200).json({
			message: "Voucher getted!",
			count : vouchers.length,
			vouchers
		})
	}catch(error){
		console.error("Get all vouchers failed",error)

		return res.status(500).json({
			message: "Failed get all vouchers",
			error: error.message
		})
	}
}

exports.getVoucherById = async(req,res) => {
	try {
		const {id}  = req.params

		const voucher = await Voucher.findById(id).populate("scope.products", "name")

		if(!voucher){
			return res.status(404).json({message: "Voucher not found"})
		}

		return res.status(200).jsonn({message:"Get voucher successfully", voucher})
	}catch(error){
		console.error("Get voucher by id error", error)

		res.status(500).json({message: "Failed get voucher by id",error: error.message})
	}
}

exports.updateVoucher = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            code,
            description,
            discount,
            minPurchase,
            maxDiscount,
            usage,
            usagePerUser,
            validity,
            scope,
            isActive,
        } = req.body;

        const voucher = await Voucher.findById(id);

        if (!voucher) {
            return res.status(404).json({
                message: "Voucher not found",
            });
        }

        if (code) {
            const normalizedCode = code.toUpperCase().trim();

            const existingVoucher = await Voucher.findOne({
                code: normalizedCode,
                _id: { $ne: id },
            });

            if (existingVoucher) {
                return res.status(409).json({
                    message: "Voucher code already exists",
                });
            }

            voucher.code = normalizedCode;
        }

        if (description !== undefined) {
            voucher.description = description;
        }

        if (discount) {
            if (
                discount.type === "percentage" &&
                (discount.value <= 0 || discount.value > 100)
            ) {
                return res.status(400).json({
                    message: "Percentage discount must be between 1 and 100",
                });
            }

            if (
                discount.type === "fixed" &&
                discount.value <= 0
            ) {
                return res.status(400).json({
                    message: "Fixed discount must be greater than 0",
                });
            }

            voucher.discount = discount;
        }

        if (minPurchase !== undefined) {
            voucher.minPurchase = minPurchase;
        }

        if (maxDiscount !== undefined) {
            voucher.maxDiscount = maxDiscount;
        }

        if (usage) {
            if (usage.limit !== undefined) {
                if (
                    usage.limit !== null &&
                    usage.limit < voucher.usage.usedCount
                ) {
                    return res.status(400).json({
                        message:
                            "Usage limit cannot be lower than current used count",
                    });
                }

                voucher.usage.limit = usage.limit;
            }
        }

        if (usagePerUser !== undefined) {
            voucher.usagePerUser = usagePerUser;
        }

        if (validity) {
            const startDate = new Date(
                validity.startDate ?? voucher.validity.startDate
            );

            const endDate = new Date(
                validity.endDate ?? voucher.validity.endDate
            );

            if (endDate <= startDate) {
                return res.status(400).json({
                    message: "End date must be after start date",
                });
            }

            voucher.validity = {
                startDate,
                endDate,
            };
        }

        if (scope) {
            voucher.scope = scope;
        }

        if (isActive !== undefined) {
            voucher.isActive = isActive;
        }

        await voucher.save();

        return res.status(200).json({
            message: "Voucher updated successfully",
            voucher,
        });
    } catch (error) {
        console.error("Update voucher error:", error);

        return res.status(500).json({
            message: "Failed to update voucher",
            error: error.message,
        });
    }
};

exports.deactiveVoucher = async (req,res) => {
	try{
		const {id} = req.params

		const voucher = await Voucher.findById(id)

		if(!voucher){
			return res.status(404).json({message: "Voucher not found"})
		}

		voucher.isActive : false

		await voucher.save()

		return res.status(200).json({message: "Deavtive voucher successfully", voucher})
	}catch(error){
		console.error("deactiveVoucher error", error)

		return res.status(500).json({message: "Failed deactive voucher", error: error.message})
	}
}