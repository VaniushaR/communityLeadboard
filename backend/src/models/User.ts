import { prop, getModelForClass } from "@typegoose/typegoose";

class ExperiencePoints {
	@prop()
	public points?: number;
	@prop()
	public timestamp?: Date;
}

class Community {
	@prop()
	public communityId?: string;
}

class User {
	@prop({ required: true })
	public email?: string;

	@prop({ required: true, select: false })
	public passwordHash?: string;

	@prop()
	public profilePicture?: string;

	@prop({
		required: true,
		select: false,
		default: [],
		type: () => [ExperiencePoints],
	})
	public experiencePoints?: ExperiencePoints[];

	@prop({ type: () => [Community], default: [] })
	public community?: Community[];
}

export const UserModel = getModelForClass(User);
