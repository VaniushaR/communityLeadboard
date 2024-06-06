import { prop, getModelForClass } from "@typegoose/typegoose";

class Member {
	@prop()
	public userId?: string;
}

class Community {
	@prop({ required: true })
	public name?: string;

	@prop()
	public logo?: string;

	@prop({ type: () => [Member] })
	public members?: Member[];

	@prop()
	public totalExpPoints?: number;
}

export const CommunityModel = getModelForClass(Community);
