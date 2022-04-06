/* eslint-disable new-cap */
import {BeforeInsert, Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class TrackingEntry {
	@PrimaryGeneratedColumn() id!: number;

	@Column() time!: Date;

	@Column({nullable: false}) guid!: string;

	@Column({nullable: false}) location!: string;

	@Column({nullable: false}) domain!: string;

	@BeforeInsert()
	validate() {
		if (!this.guid || !this.location || !this.domain) {
			throw new Error('values cannot be empty');
		}

		if (this.location.length > 1000) {
			throw new Error('location too long');
		}

		const guidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
		const httpPattern = /https?:\/\/(?:w{1,3}\.)?[^\s.]+(?:\.[a-z]+)*(?::\d+)?(?![^<]*(?:<\/\w+>|\/?>))/;
		if (!guidPattern.test(this.guid) || !httpPattern.test(this.domain)) {
			throw new Error('invalid format');
		}

		this.time = new Date();
	}
}
