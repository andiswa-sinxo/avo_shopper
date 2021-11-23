module.exports = function(pool) {

	async function createShop(shopName) {
		try {
			const result = await pool.query(`insert into shop (name) values ($1) returning id`, [shopName]);
		if (result.rowCount === 1) {
			return result.rows[0].id;
		}
		return null;
		} catch (error) {
			console.log(error)
		}
		
	}

	async function listShops() {
		try {
			const result = await pool.query(`select * from shop`);
		return result.rows;
		} catch (error) {
			console.log(error)
		}
		
	}

	async function dealsForShop(shopId) {
		try {
			const result = await pool.query(`select * from avo_deal where shop_id = $1`, [shopId]);
		return result.rows;
		} catch (error) {
			console.log(error)
		}
		
	}

	async function topFiveDeals() {
		try {
			const bestPriceSQL = `select name as shop_name, price, qty, round((price/qty), 2) as unit_price from avo_deal 
		join shop on shop.id = avo_deal.shop_id 
		order by (price/qty) asc 
		limit 5`

		const result = await pool.query(bestPriceSQL);
		return result.rows;
		} catch (error) {
			console.log(error)
		}
		

	}

	async function createDeal(shopId, qty, price) {
		try {
			await pool.query(`insert into avo_deal (shop_id, qty, price) values ($1, $2, $3)`, 
			[shopId, qty, price]);
		} catch (error) {
			console.log(error)
		}
		
	}

	async function recommendDeals(amount) {
		try {
			const result = await pool.query(`
			select name, price, qty, round((price/qty), 2) as unit_price from avo_deal 
			join shop on shop.id = avo_deal.shop_id 
			where price <= $1 order by unit_price asc`, [amount]);

		return result.rows;
		} catch (error) {
			console.log(error)
		}
		
	}

	return {
		createDeal,
		createShop,
		listShops,
		dealsForShop,
		recommendDeals,
		topFiveDeals
	}


}